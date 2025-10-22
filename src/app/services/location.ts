import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class LocationService {
  async ensurePermissions(): Promise<PermissionStatus> {
    const perm = await Geolocation.checkPermissions();
    if (perm.location === 'granted' || perm.coarseLocation === 'granted') return perm;
    return Geolocation.requestPermissions();
  }

  async getCurrentPosition(): Promise<Position> {
    try {
      return await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000, // ⏰ Aumentamos el tiempo a 30 s
        maximumAge: 0,
      });
    } catch (err) {
      console.warn('⚠️ Error al obtener posición:', err);
      // Fallback genérico si no hay señal o permiso
      return {
        coords: {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as Position;
    }
  }

  async watchPosition(onPos: (p: Position) => void, onErr?: (e: any) => void): Promise<string> {
    const id = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (pos, err) => {
        if (pos) onPos(pos);
        else if (err && onErr) onErr(err);
      }
    );
    return id as unknown as string;
  }

  async clearWatch(id: string): Promise<void> {
    await Geolocation.clearWatch({ id });
  }
}
