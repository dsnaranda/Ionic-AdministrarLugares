import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,AlertController, IonItem, IonCardTitle, IonLabel, IonFab, IonFabButton, IonIcon, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Comentario, Lugar } from 'src/app/models/Lugar';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LugaresService } from 'src/app/service/lugares.service';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, closeCircleOutline, pencilOutline, home, film   } from 'ionicons/icons';

@Component({
  selector: 'app-detallelugar',
  templateUrl: './detallelugar.page.html',
  styleUrls: ['./detallelugar.page.scss'],
  standalone: true,
  imports: [IonButtons, IonBackButton, IonButton, IonIcon, IonFabButton, IonFab, IonLabel, IonCardTitle, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,RouterLink]
})
export class DetallelugarPage implements OnInit, OnDestroy {

  lugar?: Lugar;
  comentario: Comentario = { name: '', comentario: '' };
  private lugarSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lugaresService: LugaresService,
    private alertController: AlertController
  ) {
    addIcons({ pencilOutline, closeCircleOutline, chatbubblesOutline, home, film });
  }

  ngOnInit() {
    const lugarId = this.route.snapshot.paramMap.get('id');
    
    if (lugarId) {
      // Obtener el lugar desde la API
      this.lugaresService.getLugar(lugarId).subscribe({
        next: (data: any) => {
          // Aseguramos que el lugar recibido tenga el _id
          const { _id, ...restoLugar } = data;
          
          // Asignamos _id a id y luego lo asignamos al lugar
          this.lugar = {
            ...restoLugar,
            id: _id, // Asignamos _id a id
          };
        },
        error: (err) => console.error('Error obteniendo lugar:', err)
      });
  
      // Suscribirse a cambios en el lugar
      this.lugarSubscription = this.lugaresService.lugarActualizado$.subscribe((lugar: Lugar | null) => {
        if (!lugar) {
          this.router.navigate(['/lugares']);  // Redirigir si el lugar se eliminó
        } else if (lugar.id === lugarId) {
          this.lugar = lugar;
        }
      });
    } else {
      console.error('El parámetro ID es nulo');
    }
  }
  

  ngOnDestroy() {
    this.lugarSubscription?.unsubscribe();
  }

  async mostrarFormularioComentario() {
    const alert = await this.alertController.create({
      header: 'Agregar Comentario',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre' },
        { name: 'comentario', type: 'text', placeholder: 'Comentario' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Agregar', handler: (data) => this.agregarComentario(data.name, data.comentario) }
      ]
    });

    await alert.present();
  }

  agregarComentario(name: string, comentario: string) {
    if (this.lugar && name && comentario) {
      this.lugaresService.addComentario(this.lugar.id, { name, comentario }).subscribe({
        next: (updatedLugar) => this.lugar = updatedLugar,
        error: (err) => console.error('Error agregando comentario:', err)
      });
    }
  }

  async confirmarEliminacion() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este lugar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminarLugar() }
      ]
    });

    await alert.present();
  }

  eliminarLugar() {
    if (this.lugar) {
      this.lugaresService.deleteLugar(this.lugar.id).subscribe({
        next: () => {
          this.router.navigate(['/lugares']).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          });
        },
        error: (err) => console.error('Error eliminando lugar:', err)
      });
    }
  }
  

}