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
  imports: [IonButton, IonList, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar,IonInput ,CommonModule, FormsModule]
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
    if (lugarIdParam !== null) {
      const lugarId = +lugarIdParam;
      this.lugar = this.lugaresService.getLugar(lugarId);
      if (this.lugar && this.lugar.comentarios) {
        this.comentariosEditando = [...this.lugar.comentarios];
      }
    } else {
      console.error('El parámetro ID es nulo');
    }
  }

  guardarCambios() {
    if (this.lugar) {
      console.log('Antes de actualizar:', this.lugar.comentarios);
      this.lugar.comentarios = [...this.comentariosEditando];
      this.lugaresService.updateLugar(this.lugar);
      console.log('Después de actualizar:', this.lugar.comentarios);
      this.router.navigate(['/detallelugar', this.lugar.id]);
    }
  }
  
  eliminarComentario(index: number) {
    this.comentariosEditando.splice(index, 1);
  }
}
