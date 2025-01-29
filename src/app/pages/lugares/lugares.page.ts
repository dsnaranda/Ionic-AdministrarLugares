import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonRow, IonCol, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule]
})
export class LugaresPage implements OnInit {

  lugares: Lugar[] = [];
  private lugarSubscription?: Subscription;

  constructor(private router: Router, private lugaresService: LugaresService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
    addIcons({ airplane, globe, addOutline });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando de la base de datos',
      duration: 1500, 
    });
  
    await loading.present();    
    await new Promise(resolve => setTimeout(resolve, 3000));
    await loading.dismiss();
  }

  ngOnInit() {
    this.lugares = this.lugaresService.getLugares();
    this.lugarSubscription = this.lugaresService.lugarActualizado$.subscribe((lugar: Lugar | null) => {
      if (lugar === null) {
        this.lugares = this.lugaresService.getLugares();  // Recargar la lista completa de lugares
      } else {
        const index = this.lugares.findIndex(l => l.id === lugar.id);
        if (index !== -1) {
          this.lugares[index] = lugar;
        }
      }
    });
  }
  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: AgregarlugarPage
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.lugaresService.addLugar(data.data);
        this.lugares = this.lugaresService.getLugares();
        console.log(this.lugares);  // Actualizar la lista de lugares
      }
    });

    return await modal.present();

  }

  async verDetalle(id: number) {
    await this.showLoading();
    this.router.navigate(['/detallelugar', id]);
  }

  ngOnDestroy() {
    this.lugarSubscription?.unsubscribe();
  }

}
