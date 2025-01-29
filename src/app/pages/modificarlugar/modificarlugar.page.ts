import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonButton, IonInput } from '@ionic/angular/standalone';
import { Comentario, Lugar } from 'src/app/models/Lugar';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from 'src/app/service/lugares.service';

@Component({
  selector: 'app-modificarlugar',
  templateUrl: './modificarlugar.page.html',
  styleUrls: ['./modificarlugar.page.scss'],
  standalone: true,
  imports: [IonButton, IonList, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, CommonModule, FormsModule]
})
export class ModificarlugarPage implements OnInit {

  lugar?: Lugar;
  comentariosEditando: Comentario[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lugaresService: LugaresService
  ) { }

  ngOnInit() {
    const lugarIdParam = this.route.snapshot.paramMap.get('id');
    
    if (lugarIdParam) { 
      this.lugaresService.getLugar(lugarIdParam).subscribe({
        next: (lugar: any) => {
          const { _id, ...restoLugar } = lugar;
          this.lugar = {
            ...restoLugar,
            id: _id, 
          };
          if (this.lugar) {
            this.comentariosEditando = [...this.lugar.comentarios];  
          }
        },
        error: (err) => {
          console.error('Error al obtener el lugar:', err);
        }
      });
    } else {
      console.error('El parámetro ID es nulo');
    }
  }
  
  guardarCambios() {
    if (this.lugar) {
      this.lugar.comentarios = [...this.comentariosEditando];
      this.lugaresService.updateLugar(this.lugar.id, this.lugar).subscribe({
        next: (updatedLugar: any) => {
          console.log('Lugar actualizado:', updatedLugar);
          const lugarConId = { ...updatedLugar, id: updatedLugar._id };  
          this.router.navigate(['/detallelugar', lugarConId.id]).then(() => {
            window.location.reload(); 
          });
        },
        error: (err) => {
          console.error('Error al actualizar el lugar:', err);
        }
      });
    }
  }
  
  eliminarComentario(index: number) {
    this.comentariosEditando.splice(index, 1);  // Eliminar comentario de la lista temporal
  }
}