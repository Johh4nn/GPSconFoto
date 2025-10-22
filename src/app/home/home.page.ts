import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { LocationService } from '../services/location';
import { PhotoService, PhotoLocation } from '../services/photo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, NgIf
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  latestPhoto = signal<PhotoLocation | null>(null);
  status = signal<string | null>(null);
  historial = signal<string | null>(null);

  private photoSvc = new PhotoService();

  constructor(private loc: LocationService) {}

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.obtenerUbicacionActual();
    await this.iniciarSeguimiento();
  }

  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.latitude.set(pos.coords.latitude);
      this.longitude.set(pos.coords.longitude);
      this.errorMsg.set(null);
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al obtener la ubicación actual');
    }
  }

  async iniciarSeguimiento() {
    try {
      this.watchId = await this.loc.watchPosition(
        (pos) => {
          this.latitude.set(pos.coords.latitude);
          this.longitude.set(pos.coords.longitude);
        },
        (err) => {
          this.errorMsg.set(err?.message ?? 'Error en seguimiento de ubicación');
        }
      );
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'No se pudo iniciar el seguimiento');
    }
  }

  async detenerSeguimiento() {
    if (this.watchId) {
      await this.loc.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // 📸 Tomar foto y guardar ubicación
  async tomarFoto() {
    try {
      this.status.set('Tomando foto...');
      const photo = await this.photoSvc.takePhotoAndSave();
      this.latestPhoto.set(photo);
      this.status.set('Foto y ubicación guardadas correctamente.');
    } catch (err: any) {
      console.error(err);
      this.status.set('Error al tomar o guardar la foto.');
    }
  }

  // 📜 Leer el contenido del archivo ubicaciones.txt
  async verHistorial() {
    const data = await this.photoSvc.readLocationsFile();
    this.historial.set(data);
    this.status.set(data ? 'Historial cargado.' : 'No hay ubicaciones guardadas.');
  }

  // 💾 Descargar el archivo ubicaciones.txt
  async descargarHistorial() {
    try {
      const data = await this.photoSvc.readLocationsFile();
      if (!data) {
        this.status.set('No hay datos para descargar.');
        return;
      }

      // Crear un blob con el contenido
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      // Crear un link temporal y simular click
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ubicaciones.txt';
      a.click();

      // Liberar memoria
      URL.revokeObjectURL(url);
      this.status.set('Archivo descargado correctamente.');
    } catch (err) {
      console.error(err);
      this.status.set('Error al descargar el archivo.');
    }
  }

  ngOnDestroy() {
    if (this.watchId) this.loc.clearWatch(this.watchId);
  }
}
