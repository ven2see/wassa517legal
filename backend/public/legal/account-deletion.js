/* The JWT exists only during this request. No cookies or storage are used. */
(function (root) {
  async function deleteAccount({ apiBaseUrl, email, password, fetchImpl = root.fetch }) {
    if (!apiBaseUrl)
      throw new Error(
        'El formulario de eliminación todavía no está disponible. Contacta con soporte.',
      );
    const endpoint = new URL(apiBaseUrl);
    if (
      endpoint.protocol !== 'https:' ||
      endpoint.username ||
      endpoint.password ||
      endpoint.search ||
      endpoint.hash ||
      endpoint.pathname !== '/api'
    )
      throw new Error(
        'El formulario de eliminación todavía no está disponible. Contacta con soporte.',
      );
    const api = endpoint.href.replace(/\/$/, '');
    async function request(path, body, token) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetchImpl(api + path, {
          method: token ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
          },
          body: JSON.stringify(body),
          credentials: 'omit',
          cache: 'no-store',
          referrerPolicy: 'no-referrer',
          signal: controller.signal,
        });
        if (token && response.status === 204) return null;
        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error('El servicio devolvió una respuesta que no pudimos confirmar.');
        }
        if (!response.ok) throw new Error(data.error || 'No se pudo completar la solicitud.');
        if (token) throw new Error('El servidor no confirmó el borrado. Contacta con soporte.');
        if (typeof data.token !== 'string' || !data.token.trim())
          throw new Error('No se pudo verificar la cuenta.');
        return data.token;
      } finally {
        clearTimeout(timeout);
      }
    }
    const token = await request('/auth/login', { email: email.trim(), password });
    await request('/users/me', { password }, token);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { deleteAccount };
  if (!root.document) return;
  const form = root.document.getElementById('delete-account-form');
  if (!form) return;
  const status = root.document.getElementById('deletion-status');
  const button = root.document.getElementById('delete-submit');
  let busy = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    busy = true;
    status.textContent = 'Verificando tu cuenta y procesando la eliminación…';
    status.className = 'status';
    button.textContent = 'Eliminando…';
    for (const field of form.elements) field.disabled = true;
    try {
      await deleteAccount({
        apiBaseUrl: root.WASSA_LEGAL_CONFIG?.apiBaseUrl || '',
        email: form.elements.email.value,
        password: form.elements.password.value,
      });
      form.reset();
      status.textContent =
        'Tu cuenta y sus datos de la base de datos activa de Wassa517 se han eliminado. Los mensajes ya enviados en WhatsApp y las suscripciones externas permanecen.';
      status.className = 'status success';
      button.textContent = 'Cuenta eliminada';
    } catch (error) {
      status.textContent =
        error.message && error.name !== 'TypeError' && error.name !== 'AbortError'
          ? error.message
          : 'No pudimos confirmar la eliminación. Revisa tu conexión y el estado de tu cuenta o contacta con soporte antes de reintentar.';
      status.className = 'status error';
      button.textContent = 'Eliminar cuenta y datos';
      for (const field of form.elements) field.disabled = false;
      busy = false;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
