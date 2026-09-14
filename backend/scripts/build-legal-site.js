const fs = require('node:fs');
const path = require('node:path');
const documents = require('../src/legal/documents');
const root = path.join(__dirname, '../..');
function publicUrl(value, api = false) {
  const uri = new URL(value);
  if (
    uri.protocol !== 'https:' ||
    uri.username ||
    uri.password ||
    uri.search ||
    uri.hash ||
    uri.hostname.endsWith('.invalid') ||
    uri.hostname === 'localhost' ||
    uri.hostname.endsWith('.example') ||
    (api && uri.pathname.replace(/\/$/, '') !== '/api')
  )
    throw new Error('Usa una URL pública HTTPS válida' + (api ? ' terminada en /api.' : '.'));
  return uri.href.replace(/\/$/, '');
}
function build({
  config = {},
  preview = false,
  allowPreview = false,
  output = path.join(root, 'release/legal-site'),
} = {}) {
  config = { ...config };
  const missingConfiguration = [
    'legalBusinessName',
    'supportEmail',
    'dataRetentionDetails',
    'apiBaseUrl',
    'siteBaseUrl',
  ].some((key) => !String(config[key] || '').trim());
  preview = preview || (allowPreview && missingConfiguration);
  if (!preview) {
    if (!documents.ready(config))
      throw new Error('Completa LEGAL_BUSINESS_NAME, SUPPORT_EMAIL y DATA_RETENTION_DETAILS.');
    if (!/^[^\s<>"@]+@[^\s<>"@]+\.[^\s<>"@]+$/.test(config.supportEmail))
      throw new Error('SUPPORT_EMAIL inválido.');
    config.apiBaseUrl = publicUrl(config.apiBaseUrl, true);
    config.siteBaseUrl = publicUrl(config.siteBaseUrl);
  }
  const site = config.siteBaseUrl ? new URL(config.siteBaseUrl) : null;
  const basePath = site ? site.pathname.replace(/\/$/, '') : '';
  if (!/^(\/[a-zA-Z0-9._-]+)*$/.test(basePath)) throw new Error('Ruta del sitio inválida.');
  const options = {
    staticSite: true,
    preview,
    basePath,
    apiOrigin: !preview && config.apiBaseUrl ? new URL(config.apiBaseUrl).origin : '',
  };
  fs.mkdirSync(output, { recursive: true });
  const pages = {
    'index.html': documents.homePage(config, options),
    'privacy/index.html': documents.privacyPage(config, options),
    'account/delete/index.html': documents.deletionForm(config, {
      ...options,
      clientDeletion: true,
    }),
    'support/index.html': documents.supportPage(config, options),
    'terms/index.html': documents.termsPage(config, options),
  };
  for (const [name, html] of Object.entries(pages)) {
    const file = path.join(output, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }
  fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
  for (const file of ['legal.css', 'account-deletion.js', 'brand.png'])
    fs.copyFileSync(
      path.join(root, 'backend/public/legal', file),
      path.join(output, 'assets', file),
    );
  fs.writeFileSync(
    path.join(output, 'assets/legal-config.js'),
    'window.WASSA_LEGAL_CONFIG = ' +
      JSON.stringify({
        apiBaseUrl: preview ? '' : config.apiBaseUrl || '',
        deletionEnabled: !preview,
      }).replace(/</g, '\\u003c') +
      ';\n',
  );
  fs.writeFileSync(path.join(output, '.nojekyll'), '');
  const paths = documents.links(options);
  const origin = site?.origin || '';
  const urls = {
    draft: preview,
    site_url: config.siteBaseUrl || null,
    privacy_url: site ? origin + paths.privacy : null,
    account_deletion_url: site ? origin + paths.deletion : null,
    support_url: site ? origin + paths.support : null,
    terms_url: site ? origin + paths.terms : null,
  };
  fs.writeFileSync(path.join(output, 'urls.json'), JSON.stringify(urls, null, 2) + '\n');
  const markdown =
    '# Política de privacidad de Wassa517\n\nVigente desde el ' +
    documents.EFFECTIVE_DATE +
    '.\n\n' +
    (preview ? '**Borrador: faltan datos reales del responsable y conservación.**\n\n' : '') +
    documents
      .privacySections(config, options)
      .map(([title, body]) => '## ' + title + '\n\n' + body + '\n')
      .join('\n');
  fs.writeFileSync(path.join(output, 'privacy-policy.es.md'), markdown);
  return urls;
}
function main() {
  const configPath =
    process.env.WASSA_LEGAL_CONFIG_FILE || path.join(root, 'release/legal.config.json');
  const fileConfig = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  const config = { ...fileConfig };
  for (const [key, name] of Object.entries({
    legalBusinessName: 'LEGAL_BUSINESS_NAME',
    supportEmail: 'SUPPORT_EMAIL',
    dataRetentionDetails: 'DATA_RETENTION_DETAILS',
    apiBaseUrl: 'WASSA_API_BASE_URL',
    siteBaseUrl: 'WASSA_LEGAL_SITE_URL',
  }))
    if (process.env[name]) config[key] = process.env[name].trim();
  const urls = build({
    config,
    preview: process.argv.includes('--preview'),
    allowPreview: process.argv.includes('--allow-preview'),
  });
  console.log(JSON.stringify(urls, null, 2));
}
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Sitio legal no generado: ' + error.message);
    process.exitCode = 1;
  }
}
module.exports = { build, publicUrl };
