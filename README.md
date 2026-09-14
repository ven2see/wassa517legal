# Wassa517 · Privacidad y cuentas

Sitio público de privacidad, eliminación de cuenta, soporte y condiciones de Wassa517.
GitHub Pages aloja las páginas; la API de Railway verifica y elimina la cuenta.

## Activar la publicación

1. En Settings → Pages, selecciona GitHub Actions como origen.
2. En Settings → Secrets and variables → Actions → Variables, añade:

| Variable | Valor real requerido |
| --- | --- |
| LEGAL_BUSINESS_NAME | Nombre de la persona o empresa responsable del servicio. |
| SUPPORT_EMAIL | Correo de soporte y privacidad. |
| DATA_RETENTION_DETAILS | Plazos efectivos de registros, backups y proveedores; tratamiento de restauraciones. |
| WASSA_API_BASE_URL | URL pública HTTPS del backend Railway terminada en `/api`. |

3. En Railway añade `https://ven2see.github.io` a `CORS_ORIGINS`, sin la ruta del repositorio, y configura también las tres variables legales.
4. En Actions ejecuta “Publicar privacidad y cuentas en GitHub Pages” desde `main`.

La generación requiere los datos reales. No publica automáticamente una política con campos vacíos.

## Direcciones previstas después de publicar

- Sitio: https://ven2see.github.io/wassa517legal/
- Privacidad: https://ven2see.github.io/wassa517legal/privacy/
- Eliminación: https://ven2see.github.io/wassa517legal/account/delete/
- Soporte: https://ven2see.github.io/wassa517legal/support/
- Condiciones: https://ven2see.github.io/wassa517legal/terms/

Estas direcciones estarán disponibles tras activar Pages y completar un despliegue satisfactorio. No son un aviso de publicación.

## Probar localmente

Con Node 24 y Python 3, desde la raíz:

```sh
node --test backend/test/legal_site.test.js
node backend/scripts/build-legal-site.js --preview
python3 -m http.server 8087 --directory release/legal-site
```

Abre http://localhost:8087. La vista previa indica los datos pendientes; el formulario no confirma un borrado si falta la API.

## Eliminación

El formulario solicita correo, contraseña y confirmación. Autentica con `/api/auth/login` y después llama a `DELETE /api/users/me`. Solo muestra éxito cuando el backend confirma `204`. El JWT se utiliza durante la solicitud y no se guarda en cookies o almacenamiento local. No cancela suscripciones externas ni retira mensajes ya entregados en WhatsApp.

No incluyas credenciales de PostgreSQL, claves de OpenAI/Meta o secretos JWT en este repositorio. Los únicos datos configurados para el sitio son públicos.

[Guía de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [Eliminación de cuentas en Google Play](https://support.google.com/googleplay/android-developer/answer/13327111)
