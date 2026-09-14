# Privacidad y eliminación en GitHub Pages

El sitio incluye política de privacidad, eliminación de cuenta, soporte y
condiciones de uso, con la identidad visual de Wassa517. GitHub Pages sirve el
HTML; Railway ejecuta la autenticación y el borrado. No se ha publicado el sitio.

## Publicar

1. Sube estos archivos al repositorio, conservando sus carpetas. El ZIP
   del proyecto Flutter contiene el sitio fuente y el workflow;
   puede usarse en un repositorio separado sin subir todo el proyecto Flutter.
2. En **Settings → Pages → Build and deployment**, elige **GitHub Actions**.
3. En **Settings → Secrets and variables → Actions → Variables**, crea las
   cuatro variables siguientes con datos reales:

| Variable | Valor |
| --- | --- |
| `LEGAL_BUSINESS_NAME` | Nombre legal de la persona o empresa responsable de Wassa517. |
| `SUPPORT_EMAIL` | Correo de soporte y privacidad que atiendes. |
| `DATA_RETENTION_DETAILS` | Plazos efectivos de logs, backups, caducidad, restauraciones y conservación en proveedores. |
| `WASSA_API_BASE_URL` | URL HTTPS estable de Railway terminada en `/api`. |

4. En Railway configura también las tres variables legales y añade el origen
   de Pages a `CORS_ORIGINS`. Por ejemplo: `https://USUARIO.github.io`.
   Se usa el origen **sin el nombre del repositorio**. Conserva otros orígenes
   autorizados separados por comas. Vuelve a desplegar el backend.
5. En **Actions → Publicar privacidad y cuentas en GitHub Pages → Run workflow**,
   ejecuta el workflow desde `main`. Después se ejecuta al cambiar sus fuentes en
   esa rama. Si usas otra rama, actualiza `branches` en el YAML.
6. Abre el enlace del despliegue y comprueba todas las páginas. El workflow
   obtiene el dominio y la ruta del repositorio automáticamente desde GitHub.

La generación de producción requiere responsable, correo, conservación y ambas
URLs válidas. El workflow publica una vista previa marcada como borrador si faltan datos.
En esa vista, el formulario de eliminación está deshabilitado y no admite credenciales.
No uses esos documentos en Play Console hasta completar la configuración y comprobar
`draft: false` en `urls.json`. No se inventaron datos
de contacto ni plazos. Revisa que el texto de conservación describa tus
prácticas efectivas antes de publicarlo.

## Enlaces para Play Console

Si el repositorio es `wassa517`, los enlaces normalmente tendrán este formato:

```text
https://USUARIO.github.io/wassa517/privacy/
https://USUARIO.github.io/wassa517/account/delete/
https://USUARIO.github.io/wassa517/support/
https://USUARIO.github.io/wassa517/terms/
```

Son ejemplos: reemplaza usuario/repositorio por los reales. Un dominio propio
puede cambiar la estructura. El archivo público `urls.json` del sitio contiene
las URLs generadas. Estarán disponibles después de un despliegue satisfactorio.
Un enlace al archivo HTML en github.com no sustituye la página publicada.

En `release/play-store.env` configura `PRIVACY_POLICY_URL` y
`ACCOUNT_DELETION_URL` con esas URLs reales, además de `API_BASE_URL` de Railway.
En el proyecto Flutter original, ejecuta `python3 tool/build_play_store.py --check-only` y genera el AAB
conectado siguiendo su guía `docs/PLAY_STORE.md`.

## Eliminación desde la web

El formulario público funciona sin instalar Flutter. Pide correo, contraseña y
confirmación; llama a `/api/auth/login` y después a `DELETE /api/users/me`, con
JWT efímero y comprobación adicional de contraseña. Solo informa éxito cuando
el backend responde `204`. El sitio no guarda contraseña ni JWT en cookies o
almacenamiento local. El endpoint aplica limitación de intentos y borra los datos
asociados en una transacción.

Configurar GitHub Pages por sí solo no activa el borrado: Railway debe estar
disponible y aceptar el origen CORS. Compruébalo con una cuenta ficticia creada
para esa prueba. Verifica que esa cuenta no pueda volver a iniciar sesión ni
acceder a sus conversaciones. Los mensajes ya entregados en WhatsApp y las
suscripciones externas no se borran ni cancelan con esta acción. La política
explica la conservación y el canal de solicitudes sobre copias y proveedores.

El backend también conserva sus rutas propias `/privacy`, `/account/delete`,
`/support` y `/terms`. Ambos sitios usan el mismo contenido legal.

## Vista previa local

Desde la raíz, con Node 24 y Python 3:

```sh
node --test backend/test/legal_site.test.js
node backend/scripts/build-legal-site.js --preview
python3 -m http.server 8087 --directory release/legal-site
```

Abre `http://localhost:8087`. Sin una API configurada, el formulario indica que
todavía no está disponible y no confirma un borrado. Para generar localmente
con datos reales, copia `release/legal.config.example.json` a
`release/legal.config.json`, completa los cinco campos públicos y ejecuta:

```sh
node backend/scripts/build-legal-site.js
```

El archivo de configuración local y el resultado generado están excluidos de
Git. El workflow publica únicamente `release/legal-site`; no publica `.env`,
claves de firma Android ni archivos del backend. No pongas tokens de OpenAI,
Meta, JWT o PostgreSQL en variables públicas, JavaScript o en este ZIP.

## Referencias

- [GitHub Pages con workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Eliminación de cuentas en Google Play](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Política de datos de usuario](https://support.google.com/googleplay/android-developer/answer/10144311)
