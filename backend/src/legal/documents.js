// Shared legal copy for Express and GitHub Pages. Public configuration only.
const EFFECTIVE_DATE = '14 de septiembre de 2026';
const escape = (value = '') =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const ready = (config) =>
  !!(config.legalBusinessName && config.supportEmail && config.dataRetentionDetails);
function links(options = {}) {
  const base = options.basePath || '';
  const suffix = options.staticSite ? '/' : '';
  return {
    home: base + (options.staticSite ? '/' : '/legal'),
    privacy: base + '/privacy' + suffix,
    deletion: base + '/account/delete' + suffix,
    support: base + '/support' + suffix,
    terms: base + '/terms' + suffix,
    css: base + (options.staticSite ? '/assets/legal.css' : '/legal.css'),
    brand: base + (options.staticSite ? '/assets/brand.png' : '/legal/brand.png'),
  };
}
function contact(config) {
  return config.supportEmail
    ? `<a href="mailto:${escape(config.supportEmail)}">${escape(config.supportEmail)}</a>`
    : '[Correo de soporte por completar]';
}
function privacySections(config, options = {}) {
  const path = links(options);
  return [
    [
      'Responsable y contacto',
      `<p>Esta política explica cómo Wassa517, aplicación con paquete <strong>com.wassa517.app</strong>, utiliza la información del dueño de un negocio y de sus clientes. El responsable del servicio es <strong>${escape(config.legalBusinessName || '[Nombre del responsable por completar]')}</strong>. Para consultas sobre privacidad o solicitudes sobre tus datos, escribe a ${contact(config)}.</p>`,
    ],
    [
      'Información que tratamos',
      `<ul><li><strong>Cuenta:</strong> correo electrónico, identificador de usuario, nombre del negocio y hash de la contraseña. La contraseña se transmite para autenticarte o confirmar la eliminación; no se guarda en texto legible.</li><li><strong>Negocio:</strong> productos, precios, existencias, enlaces de imágenes, instrucciones, horarios y estado del Piloto Automático.</li><li><strong>WhatsApp:</strong> identificador del número conectado, teléfonos de clientes, mensajes, respuestas de IA, estado de la conversación y recibos de entrega. Los medios recibidos se registran como referencias de tipo o descripción; Wassa517 no descarga ni analiza automáticamente su contenido.</li><li><strong>Reportes:</strong> motivo elegido, cuenta y respuesta de IA asociada cuando utilizas la bandera del chat.</li><li><strong>Funcionamiento:</strong> identificadores y estados de trabajos pendientes, errores operativos y datos de conexión necesarios para prestar el servicio. Los plazos de los registros del hosting se describen en Conservación.</li></ul>`,
    ],
    [
      'Para qué usamos la información',
      '<p>Para crear y administrar tu cuenta, organizar el catálogo, atender conversaciones, enviar mensajes, aplicar las reglas y horarios del negocio, generar respuestas con IA, comprobar contenido mediante moderación, revisar reportes y mantener el servicio. No incorporamos anuncios ni un SDK de seguimiento publicitario y no utilizamos conversaciones para publicidad personalizada.</p>',
    ],
    [
      'IA, WhatsApp y proveedores',
      '<p>Railway aloja el backend y PostgreSQL. OpenAI recibe las instrucciones, el catálogo y el historial reciente para generar respuestas; su servicio de moderación comprueba texto entrante y respuestas. No enviamos a OpenAI la contraseña ni las credenciales de acceso del dueño. Un mensaje puede contener información personal escrita por un cliente: evita introducir información sensible que no sea necesaria para atenderlo.</p><p>Meta/WhatsApp procesa los teléfonos, mensajes y estados necesarios para las comunicaciones. Al mostrar una imagen de producto, la app solicita el archivo al host de su URL HTTPS, que recibe la petición de red. GitHub Pages aloja estas páginas informativas cuando se publican allí; el formulario envía las credenciales al backend de Wassa517, no a un repositorio de GitHub.</p><p>Los proveedores pueden tratar información fuera de tu país, conforme a sus contratos y políticas. Consulta <a href="https://openai.com/policies/privacy-policy/" rel="noopener noreferrer">OpenAI</a>, <a href="https://developers.openai.com/api/docs/guides/your-data" rel="noopener noreferrer">controles de datos de su API</a>, <a href="https://www.whatsapp.com/legal/privacy-policy" rel="noopener noreferrer">WhatsApp</a>, <a href="https://railway.com/legal/privacy" rel="noopener noreferrer">Railway</a> y <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener noreferrer">GitHub</a>.</p>',
    ],
    [
      'Almacenamiento y seguridad',
      '<p>La app conserva el token de sesión y el perfil en las preferencias locales para mantener el acceso. Al cerrar sesión o eliminar la cuenta, elimina esa sesión local. Las conexiones públicas de Wassa517 utilizan HTTPS; las contraseñas se guardan con bcrypt y las consultas de cada negocio requieren autenticación y se limitan a sus recursos.</p><p>El backend necesita leer los mensajes para responder con IA. El tratamiento dentro de Wassa517 no es cifrado de extremo a extremo entre el cliente y OpenAI. La app no solicita acceso a contactos, SMS, ubicación, cámara o micrófono del teléfono.</p>',
    ],
    [
      'Conservación',
      `<p>Los datos operativos de cuenta, catálogo, configuración y conversaciones permanecen mientras exista la cuenta, salvo solicitud de eliminación. Los trabajos pendientes se conservan para permitir procesamiento y recuperación ante fallos.</p><p>${escape(config.dataRetentionDetails || '[Completar plazos reales de registros, backups, restauraciones y proveedores antes de publicar.]')}</p><p>La eliminación de la base de datos activa no retira mensajes ya entregados en WhatsApp ni elimina automáticamente información que terceros deban conservar conforme a sus propias obligaciones. El responsable atiende las solicitudes que requieran actuación sobre copias o proveedores.</p>`,
    ],
    [
      'Eliminar tu cuenta y solicitar información',
      `<p>Puedes eliminar la cuenta en <strong>Configuración → Eliminar mi cuenta</strong> o en <a href="${path.deletion}">el formulario de eliminación</a>, sin reinstalar la app. Se verifica tu contraseña y se borran de PostgreSQL activo la cuenta, catálogo, ajustes, conexión, conversaciones, mensajes, reportes de IA y trabajos relacionados. La eliminación es inmediata cuando el servidor la confirma y no se puede deshacer.</p><p>No cancela suscripciones externas ni elimina mensajes ya enviados en WhatsApp. Para solicitar acceso, corrección, eliminación de datos concretos o información sobre copias, escribe a ${contact(config)}. No envíes contraseñas ni credenciales de OpenAI o Meta por correo.</p>`,
    ],
    [
      'Clientes del negocio',
      '<p>El dueño debe informar a sus clientes del uso de WhatsApp e IA y disponer de autorización o fundamento aplicable para tratar sus conversaciones. Las solicitudes de un cliente deben dirigirse primero al negocio que lo atendió; este puede contactar con el responsable de Wassa517 para gestionarlas.</p>',
    ],
    [
      'Cambios en esta política',
      '<p>Actualizaremos esta página cuando cambien las prácticas del servicio e indicaremos la fecha vigente. Los cambios que requieran información o consentimiento adicional se comunicarán por los medios disponibles.</p>',
    ],
  ];
}
function page(title, body, config = {}, options = {}) {
  const path = links(options);
  const script = options.clientDeletion
    ? `<script src="${escape(options.basePath || '')}/assets/legal-config.js" defer></script><script src="${escape(options.basePath || '')}/assets/account-deletion.js" defer></script>`
    : '';
  const draft = options.preview
    ? '<aside class="draft" role="note">Borrador para revisión. Faltan datos del responsable, contacto, conservación o Railway. Estas páginas todavía no están listas para Play Store.</aside>'
    : '';
  const csp = options.staticSite
    ? `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' ${escape(options.apiOrigin || '')}; base-uri 'self'; form-action 'none'; object-src 'none'">`
    : '';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Privacidad, cuenta y soporte de Wassa517."><meta name="referrer" content="no-referrer">${csp}<title>${escape(title)} · Wassa517</title><link rel="icon" href="${path.brand}"><link rel="stylesheet" href="${path.css}">${script}</head><body><header class="site-header"><a class="brand" href="${path.home}"><img src="${path.brand}" width="40" height="40" alt=""><span>Wassa517</span></a><nav aria-label="Información del servicio"><a href="${path.privacy}">Privacidad</a><a href="${path.deletion}">Tu cuenta</a><a href="${path.support}">Ayuda</a></nav></header>${draft}<main>${body}</main><footer><span>Wassa517 · ${escape(config.legalBusinessName || 'Centro de privacidad')}</span><div><a href="${path.privacy}">Privacidad</a><a href="${path.terms}">Condiciones de uso</a><a href="${path.support}">Contacto</a></div></footer></body></html>`;
}
function privacyPage(config, options = {}) {
  return page(
    'Política de privacidad',
    `<section class="hero"><span class="eyebrow">TU INFORMACIÓN, CON CLARIDAD</span><h1>Política de privacidad de Wassa517</h1><p class="lead">Cómo usamos tus datos para conectar tu negocio y atender a tus clientes.</p><p class="updated">Vigente desde el ${EFFECTIVE_DATE}.</p></section><article class="document">${privacySections(
      config,
      options,
    )
      .map(([title, body]) => `<section><h2>${title}</h2>${body}</section>`)
      .join('')}</article>`,
    config,
    options,
  );
}
function deletionForm(config = {}, options = {}) {
  const path = links(options);
  const pending = options.preview && options.clientDeletion;
  const disabled = pending ? ' disabled' : '';
  const lead = pending
    ? 'Vista previa del proceso de eliminación. El formulario estará disponible cuando se complete la configuración del servicio.'
    : 'Puedes hacerlo aquí sin instalar la app. Confirma tu identidad y el servidor eliminará tus datos.';
  const error = options.error
    ? `<p class="notice error" role="alert">${escape(options.error)}</p>`
    : '';
  const noScript = options.clientDeletion
    ? `<noscript><p class="notice error">Activa JavaScript para utilizar el formulario, o solicita ayuda a ${contact(config)}. No envíes tu contraseña por correo.</p></noscript>`
    : '';
  const form = `${noScript}<form id="delete-account-form" method="post" action="${path.deletion}" autocomplete="on"><label for="email">Correo de tu cuenta</label><input id="email" name="email" type="email" autocomplete="username" maxlength="255" required${disabled}><label for="password">Contraseña actual</label><input id="password" name="password" type="password" autocomplete="current-password" required${disabled}><label class="check"><input name="confirmation" type="checkbox" value="DELETE" required${disabled}><span>Entiendo que se eliminarán mi cuenta y sus datos de Wassa517.</span></label><p id="deletion-status" class="status" role="status" aria-live="polite">${pending ? 'El formulario de eliminación todavía no está activo.' : ''}</p><button id="delete-submit" type="submit"${disabled}>${pending ? 'Pendiente de configuración' : 'Eliminar cuenta y datos'}</button></form>`;
  return page(
    'Eliminar cuenta',
    `<section class="hero"><span class="eyebrow">EL CONTROL ES TUYO</span><h1>Eliminar tu cuenta de Wassa517</h1><p class="lead">${lead}</p></section><div class="deletion-grid"><section class="card"><h2>Qué se elimina</h2><ul class="checks"><li>Cuenta y catálogo de productos.</li><li>Configuración y conexión del número.</li><li>Conversaciones y mensajes guardados.</li><li>Reportes de IA y trabajos pendientes.</li></ul><p>El borrado de la base de datos activa es inmediato al confirmarse y no se puede deshacer.</p><p class="notice">No borra mensajes que ya estén en WhatsApp ni cancela suscripciones externas. Consulta los plazos de copias y proveedores en <a href="${path.privacy}">privacidad</a>.</p><h3>También desde la app</h3><p>Abre Configuración → Eliminar mi cuenta e introduce la contraseña.</p></section><section class="card"><h2>Confirma tu cuenta</h2><p>${pending ? 'Este formulario está deshabilitado durante la vista previa.' : 'Usa el mismo correo y contraseña que utilizas en Wassa517.'}</p>${error}${form}<p class="help">¿No puedes acceder? Contacta con ${contact(config)} para una solicitud verificada. No envíes tu contraseña por correo.</p></section></div>`,
    config,
    options,
  );
}
function homePage(config, options = {}) {
  const path = links(options);
  return page(
    'Privacidad y soporte',
    `<section class="hero"><span class="eyebrow">WASSA517 · TU NEGOCIO, CONECTADO</span><h1>Tu información.<br>Tu cuenta. Tu control.</h1><p class="lead">Información clara y opciones sencillas para gestionar tu relación con Wassa517.</p></section><div class="link-grid"><a class="card link-card" href="${path.privacy}"><span class="card-symbol">01</span><h2>Privacidad</h2><p>Conoce qué datos usamos, cómo los protegemos y con quién se procesan.</p><span class="card-action">Leer la política →</span></a><a class="card link-card" href="${path.deletion}"><span class="card-symbol">02</span><h2>Tu cuenta</h2><p>Solicita el borrado de tu cuenta y sus datos, sin reinstalar la app.</p><span class="card-action">Eliminar cuenta →</span></a><a class="card link-card" href="${path.support}"><span class="card-symbol">03</span><h2>Estamos para ayudarte</h2><p>Consultas del servicio, acceso a tu cuenta y solicitudes de privacidad.</p><span class="card-action">Contactar →</span></a></div>`,
    config,
    options,
  );
}
function supportPage(config, options = {}) {
  return page(
    'Ayuda y contacto',
    `<section class="hero"><span class="eyebrow">CERCA DE TU NEGOCIO</span><h1>Hablemos.</h1><p class="lead">Ayuda con tu cuenta, WhatsApp y tus datos.</p></section><article class="document"><h2>Contacto de soporte y privacidad</h2><p>Escribe a ${contact(config)} indicando el correo de tu cuenta y el motivo de la consulta. No envíes contraseñas, tokens o información sensible de clientes.</p><h2>Solicitudes sobre datos</h2><p>Puedes solicitar acceso, corrección o eliminación de información concreta. Verificaremos tu identidad y la relación con el negocio antes de atender una solicitud.</p><h2>Conectar WhatsApp</h2><p>La mensajería necesita un número de WhatsApp Business asociado al negocio en el servicio. Si la app muestra «Pendiente de conexión», contacta con soporte para gestionar esa conexión.</p><h2>Respuestas de IA</h2><p>Si una respuesta es incorrecta o inapropiada, utiliza la bandera del chat para reportarla. Puedes pausar la IA y atender personalmente.</p></article>`,
    config,
    options,
  );
}
function termsPage(config, options = {}) {
  return page(
    'Condiciones de uso',
    `<section class="hero"><span class="eyebrow">UN SERVICIO PARA TU NEGOCIO</span><h1>Condiciones de uso</h1><p class="lead">Reglas básicas para utilizar Wassa517.</p></section><article class="document"><h2>Servicio y cuenta</h2><p>Wassa517 permite administrar catálogo y conversaciones mediante WhatsApp Business y un asistente de IA. Necesitas conexión a Internet, una cuenta y un número conectado al servicio. Protege tu contraseña y mantén actualizados los datos del negocio.</p><h2>Responsabilidad del negocio</h2><p>Debes contar con permisos para tratar los datos de tus clientes y comunicarte con ellos, cumplir las reglas de WhatsApp y mantener correctos precios, existencias e instrucciones. No uses el servicio para spam, fraude, actividades ilegales o contenido que facilite daño.</p><h2>IA y confirmaciones</h2><p>La IA puede equivocarse. Revisa las respuestas y confirma pagos, pedidos, reservas y disponibilidad personalmente. La app no cobra, reserva ni modifica el inventario automáticamente. Puedes desactivar el Piloto Automático y tomar control manual.</p><h2>Disponibilidad y terceros</h2><p>El funcionamiento depende de la red, Railway, OpenAI y Meta/WhatsApp. Puede haber interrupciones y límites de los proveedores. Los envíos fuera de la ventana permitida que necesiten plantillas no están implementados. Wassa517 es independiente y no está afiliada a WhatsApp ni Meta.</p><h2>Cuenta y servicios externos</h2><p>Eliminar la cuenta borra sus datos activos de Wassa517 y no cancela suscripciones externas. Los servicios contratados fuera de la app se rigen también por sus condiciones aplicables.</p><h2>Contacto</h2><p>Responsable: ${escape(config.legalBusinessName || '[Responsable por completar]')}. Consultas: ${contact(config)}.</p></article>`,
    config,
    options,
  );
}
module.exports = {
  EFFECTIVE_DATE,
  escape,
  ready,
  links,
  page,
  privacySections,
  privacyPage,
  deletionForm,
  homePage,
  supportPage,
  termsPage,
};
