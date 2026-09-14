const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { build } = require('../scripts/build-legal-site');
const { deleteAccount } = require('../public/legal/account-deletion');
const config = {
  legalBusinessName: 'Operador <517>',
  supportEmail: 'support@example.com',
  dataRetentionDetails: 'Conservación de prueba, no de producción.',
  apiBaseUrl: 'https://backend.example.com/api',
  siteBaseUrl: 'https://example.github.io/wassa517',
};
test('GitHub Pages mantiene el prefijo del repositorio, enlaces públicos y datos escapados', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'wassa-legal-'));
  try {
    const urls = build({ config: { ...config }, output });
    assert.equal(urls.privacy_url, 'https://example.github.io/wassa517/privacy/');
    assert.equal(urls.account_deletion_url, 'https://example.github.io/wassa517/account/delete/');
    assert.equal(urls.draft, false);
    const privacy = fs.readFileSync(path.join(output, 'privacy/index.html'), 'utf8');
    assert.match(privacy, /Operador &lt;517&gt;/);
    assert.match(privacy, /\/wassa517\/assets\/legal.css/);
    const deletion = fs.readFileSync(path.join(output, 'account/delete/index.html'), 'utf8');
    assert.match(deletion, /connect-src 'self' https:\/\/backend.example.com/);
    assert.match(deletion, /form-action 'none'/);
    assert.match(deletion, /method="post"/);
    assert.match(deletion, /account-deletion.js/);
    assert.ok(!privacy.includes('Borrador para revisión'));
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});
test('no se genera una publicación con identidad, retención o URL del backend incompletas', () => {
  for (const key of [
    'legalBusinessName',
    'supportEmail',
    'dataRetentionDetails',
    'apiBaseUrl',
    'siteBaseUrl',
  ])
    assert.throws(() => build({ config: { ...config, [key]: '' }, output: '/unused' }));
  assert.throws(() => build({ config: { ...config, apiBaseUrl: 'http://localhost:3000/api' } }));
});
test('Pages puede publicar una vista previa con rutas del repositorio y borrado deshabilitado', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'wassa-legal-preview-'));
  try {
    const urls = build({
      config: { ...config, legalBusinessName: '' },
      allowPreview: true,
      output,
    });
    assert.equal(urls.draft, true);
    assert.equal(urls.privacy_url, 'https://example.github.io/wassa517/privacy/');
    const home = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
    assert.match(home, /todavía no están listas para Play Store/);
    const deletion = fs.readFileSync(path.join(output, 'account/delete/index.html'), 'utf8');
    assert.match(deletion, /name="password"[^>]*disabled/);
    assert.match(deletion, /Pendiente de configuración/);
    const browserConfig = fs.readFileSync(path.join(output, 'assets/legal-config.js'), 'utf8');
    assert.match(browserConfig, /"apiBaseUrl":""/);
    assert.match(browserConfig, /"deletionEnabled":false/);
    assert.ok(!browserConfig.includes(config.apiBaseUrl));
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});
test('permitir una vista previa no oculta una URL inválida cuando la configuración está completa', () => {
  assert.throws(() =>
    build({ config: { ...config, apiBaseUrl: 'http://localhost:3000/api' }, allowPreview: true }),
  );
});
test('el navegador no admite credenciales ni instala el envío mientras el borrado esté deshabilitado', () => {
  const fields = [{ disabled: false }, { disabled: false }];
  let handlers = 0;
  const form = { elements: fields, addEventListener: () => handlers++ };
  const status = {};
  const button = {};
  const window = {
    WASSA_LEGAL_CONFIG: { apiBaseUrl: config.apiBaseUrl, deletionEnabled: false },
    document: {
      getElementById: (id) =>
        ({ 'delete-account-form': form, 'deletion-status': status, 'delete-submit': button })[id],
    },
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../public/legal/account-deletion.js'), 'utf8'),
    { window },
  );
  assert.ok(fields.every((field) => field.disabled));
  assert.equal(handlers, 0);
  assert.match(status.textContent, /No introduzcas credenciales/);
  assert.equal(button.textContent, 'Pendiente de configuración');
});
test('el formulario autentica, borra con JWT efímero y solo confirma un 204 del backend', async () => {
  const calls = [];
  await deleteAccount({
    apiBaseUrl: config.apiBaseUrl,
    email: ' owner@example.com ',
    password: 'test-password',
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1
        ? { ok: true, status: 200, json: async () => ({ token: 'ephemeral-token' }) }
        : { ok: true, status: 204 };
    },
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, config.apiBaseUrl + '/auth/login');
  assert.equal(calls[1].url, config.apiBaseUrl + '/users/me');
  assert.equal(calls[1].options.method, 'DELETE');
  assert.equal(calls[1].options.headers.Authorization, 'Bearer ephemeral-token');
  assert.equal(calls[1].options.credentials, 'omit');
  assert.deepEqual(JSON.parse(calls[1].options.body), { password: 'test-password' });
});
test('credenciales incorrectas no envían DELETE; una respuesta ambigua no confirma el borrado', async () => {
  let count = 0;
  await assert.rejects(
    () =>
      deleteAccount({
        apiBaseUrl: config.apiBaseUrl,
        email: 'owner@example.com',
        password: 'wrong',
        fetchImpl: async () => {
          count++;
          return {
            ok: false,
            status: 401,
            json: async () => ({ error: 'Credenciales incorrectas' }),
          };
        },
      }),
    /Credenciales incorrectas/,
  );
  assert.equal(count, 1);
  let request = 0;
  await assert.rejects(
    () =>
      deleteAccount({
        apiBaseUrl: config.apiBaseUrl,
        email: 'owner@example.com',
        password: 'test-password',
        fetchImpl: async () =>
          ++request === 1
            ? { ok: true, status: 200, json: async () => ({ token: 'token' }) }
            : { ok: true, status: 200, json: async () => ({}) },
      }),
    /no confirmó el borrado/,
  );
});
