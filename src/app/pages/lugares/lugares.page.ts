import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, LoadingController, IonToolbar, IonButtons, IonButton, IonIcon, IonFabButton, IonGrid, IonRow, IonCol, IonCardHeader, IonCard, IonCardTitle, IonFab } from '@ionic/angular/standalone';
import { Lugar } from 'src/app/models/Lugar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LugaresService } from 'src/app/service/lugares.service';
import { addIcons } from 'ionicons';
import { ModalController } from '@ionic/angular/standalone';
import { addOutline, airplane, globe } from 'ionicons/icons';
import { AgregarlugarPage } from '../agregarlugar/agregarlugar.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonRow, IonCol, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule]
})
export class LugaresPage implements OnInit, OnDestroy {

  lugares: Lugar[] = [];
  private lugarSubscription?: Subscription;
  nombreUsuario: string = '';

  constructor(
    private router: Router,
    private lugaresService: LugaresService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ airplane, globe, addOutline });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando de la base de datos',
      duration: 1500,
    });

    await loading.present();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await loading.dismiss();
  }

  ngOnInit() {
    const nombre = localStorage.getItem('nombre');
    if (nombre) {
      this.nombreUsuario = nombre;
    }
    this.loadLugares();
    this.lugarSubscription = this.lugaresService.lugarActualizado$.subscribe(() => {
      this.loadLugares();
    });
  }

  loadLugares() {
    this.lugaresService.getLugares().subscribe(
      (lugares) => {
        // Aseguramos que el tipo de lugar tenga _id de forma temporal
        this.lugares = lugares.map((lugar: any) => {
          // Aseguramos que podemos acceder al campo _id
          const { _id, ...restoLugar } = lugar;
          return {
            ...restoLugar,
            id: _id, // Usamos _id para asignarlo a id
          };
        });

        console.log("Lugares:", this.lugares);
      },
      (error) => {
        console.error('Error al cargar los lugares:', error);
      }
    );
  }


  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: AgregarlugarPage
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data) {
        try {
          await this.lugaresService.addLugar(data.data).toPromise();
          await this.loadLugares();
        } catch (error) {
          console.error('Error al agregar lugar:', error);
        }
      }
    });

    return await modal.present();
  }

  async verDetalle(id: string) {
    console.log('ID del lugar:', id);
    console.log('Lugares:', this.lugares);
    await this.showLoading();
    this.router.navigate(['/detallelugar', id]);
  }


  ngOnDestroy() {
    this.lugarSubscription?.unsubscribe();
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre'); 
    this.router.navigate(['/login']);
  }
  
}