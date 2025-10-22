import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface PhotoLocation {
  imageBase64: string;
  latitude: number;
  longitude: number;
  mapsLink: string;
  fileName: string;
}

export class PhotoService {

  /**
   * Toma una foto, obtiene ubicación y guarda ambos datos.
   * Funciona en navegador PWA y en dispositivos Android/iOS.
   */
  async takePhotoAndSave(): Promise<PhotoLocation> {
    const isWeb = Capacitor.getPlatform() === 'web';

    // 1️⃣ Tomar foto
    let photo: Photo;
    try {
      photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: isWeb ? CameraSource.Photos : CameraSource.Camera, // navegador: elegir de galería
        saveToGallery: !isWeb, // solo guardar en galería en dispositivos reales
      });
    } catch (err) {
      throw new Error(`No se pudo tomar la foto: ${(err as any).message || err}`);
    }

    // 2️⃣ Obtener ubicación actual con timeout de 10s
    let lat = 0;
    let lng = 0;
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
    };

    try {
      const pos = await Geolocation.getCurrentPosition(geoOptions);
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (err) {
      console.warn('No se pudo obtener la ubicación, usando 0,0');
      lat = 0;
      lng = 0;
    }

    const mapsLink = `https://www.google.com/maps/@${lat},${lng}`;

    // 3️⃣ Guardar foto en filesystem
    const timestamp = new Date().getTime();
    const fileName = `photo_${timestamp}.jpeg`;
    const base64Data = photo.dataUrl!.split(',')[1]; // extrae Base64

    try {
      await Filesystem.writeFile({
        path: `photos/${fileName}`,
        data: base64Data,
        directory: Directory.Data, // seguro en Android/iOS
      });
    } catch (err) {
      console.warn('No se pudo guardar la foto en filesystem:', err);
    }

    // 4️⃣ Guardar ubicación en archivo de texto
    const textFilePath = 'ubicaciones.txt';
    const line = `${new Date().toISOString()},${fileName},${lat},${lng},${mapsLink}\n`;

    let existing = '';
    try {
      const read = await Filesystem.readFile({
        path: textFilePath,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      existing = read.data as string;
    } catch {
      existing = '';
    }

    try {
      await Filesystem.writeFile({
        path: textFilePath,
        data: existing + line,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    } catch (err) {
      console.warn('No se pudo guardar ubicaciones.txt:', err);
    }

    // 5️⃣ Retornar información
    return {
      imageBase64: photo.dataUrl!,
      latitude: lat,
      longitude: lng,
      mapsLink,
      fileName,
    };
  }

  /**
   * Leer el archivo ubicaciones.txt
   */
  async readLocationsFile(): Promise<string | null> {
    try {
      const read = await Filesystem.readFile({
        path: 'ubicaciones.txt',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return read.data as string;
    } catch {
      return null;
    }
  }
}
