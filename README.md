# MiUbicacionAPP_2025B

Aplicación híbrida desarrollada con **Ionic Standalone** y **Capacitor**, que permite tomar fotos, registrar la ubicación donde fueron tomadas y guardar esta información en un archivo de texto. La aplicación también muestra un enlace a Google Maps para acceder a cada ubicación.

---

## 🔹 Características principales

- Tomar fotos con la cámara del dispositivo.
- Obtener la ubicación GPS actual al momento de tomar la foto.
- Guardar la foto en almacenamiento interno.
- Guardar un registro de cada foto con su latitud, longitud y enlace de Google Maps en `ubicaciones.txt`.
- Descargar o compartir el archivo `.txt` desde la aplicación.
- Compatible con:
  - Dispositivos Android y iOS
  - Navegador / PWA (modo desarrollo y producción)

---

## 🔹 Tecnologías utilizadas

- [Ionic Framework 7+](https://ionicframework.com/)
- [Capacitor 6+](https://capacitorjs.com/)
- Angular 16+
- Plugins de Capacitor:
  - `@capacitor/camera`
  - `@capacitor/filesystem`
  - `@capacitor/geolocation`
  - `@capacitor/share` (para exportar el `.txt` en móvil)
  - `@ionic/pwa-elements` (para compatibilidad con PWA)

---

## 🔹 Estructura de archivos relevante

- `src/app/services/photo.ts` → Servicio principal que maneja:
  - Tomar fotos
  - Obtener ubicación
  - Guardar fotos y archivo `ubicaciones.txt`
  - Descargar o compartir el `.txt`
- `src/app/home.page.ts` → Página principal:

- 
  - Botón para tomar foto y registrar ubicación
  - Botón para descargar/compartir archivo `.txt`
  - Visualización de la foto tomada y enlace de Google Maps
 
Instalar dependencias:

npm install


Inicializar PWA Elements (en main.ts):

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

## 🔹 Uso en desarrollo
PWA / navegador
ionic serve --ssl


Permite probar la cámara usando selección de fotos (CameraSource.Photos).

Descarga de ubicaciones.txt mediante Blob.

HTTPS obligatorio para geolocalización.

Android / iOS

Agregar plataforma:

ionic capacitor add android
ionic capacitor add ios


Ejecutar en dispositivo o emulador:

ionic capacitor run android -l --host=YOUR_LOCAL_IP
ionic capacitor run ios -l --host=YOUR_LOCAL_IP


La cámara funciona con CameraSource.Camera.

Ubicaciones guardadas en Directory.Data (interno) y .txt en Directory.External.

Exportar el .txt mediante Share API.

## 🔹 Funcionalidad del archivo ubicaciones.txt

Cada línea contiene:

timestamp, nombre_archivo.jpg, latitud, longitud, enlace_google_maps


Ejemplo:

2025-10-21T15:30:00.000Z,photo_1697904600000.jpeg,-0.2106699335048009,-78.48820656605636,https://www.google.com/maps/@-0.2106699335048009,-78.48820656605636

## 🔹 Consideraciones importantes

PWA: la cámara funciona mediante selección de fotos, no puede usar cámara real.

Android: el archivo ubicaciones.txt se guarda en almacenamiento externo y es visible desde apps de archivos.

iOS: se debe usar Share API para exportar el .txt.

Timeout de geolocalización: 10 segundos. Si no se obtiene ubicación, se registra 0,0.

## 🔹 Comandos útiles

ionic serve --ssl → Ejecutar en navegador con HTTPS.

ionic capacitor run android → Ejecutar en Android.

ionic capacitor run ios → Ejecutar en iOS.

npm run build → Generar build de producción.

git add . && git commit -m "mensaje" && git push → Versionado en GitHub.
