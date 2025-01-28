import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Comentario, Lugar } from '../models/Lugar';



@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  private lugares: Lugar[] = [
    {
      id: 1,
      titulo: 'Quito',
      imagen: 'https://blog.uber-cdn.com/cdn-cgi/image/width=2160,quality=80,onerror=redirect,format=auto/wp-content/uploads/2018/09/EC_X-lugares-para-visitar-en-Quito-que-no-pueden-faltar-en-tu-lista.jpg',
      comentarios: [{name: 'Jeico',comentario: 'Muy buen lugar'},{name: 'David',comentario: 'Interesante'}]
    },
    {
      id: 2,
      titulo: 'Cuenca',
      imagen: 'https://media.viajando.travel/p/390bed37b6d8f81002fd8d0e4ca39a49/adjuntos/236/imagenes/000/671/0000671562/1200x675/smart/cuencawebp.png',
      comentarios: [{name: 'Carmen',comentario: 'Muy buen lugar'},{name: 'Karen',comentario: 'Interesante'}]
    },
    {
      id: 3,
      titulo: 'Galapagos',
      imagen: 'https://www.costacruceros.es/content/dam/costa/costa-magazine/articles-magazine/islands/galapagos-islands/5-isole-galapagos-694x390.jpg.image.694.390.low.jpg',
      comentarios: [{name: 'Juan',comentario: 'Muy buen lugar'},{name: 'Pedro',comentario: 'Interesante'}]
    },
    {
      id: 4,
      titulo: 'Guayaquil',
      imagen: 'https://www.exoticca.com/_next/image?url=https%3A%2F%2Fuploads.exoticca.com%2Fglobal%2Fdestination%2Fpoi%2Fguayaquil.png&w=3840&q=75',
      comentarios: [{name: 'Vaiolet',comentario: 'Muy buen lugar'},{name: 'Cris',comentario: 'Interesante'}]
    },
    
  ];

  private lugarActualizado = new Subject<Lugar | null >();
  lugarActualizado$ = this.lugarActualizado.asObservable();
  constructor() {}

  getLugares(): Lugar[]
   {
      return [...this.lugares];
  }

  getLugar(id: number): Lugar 
  {
    const lugar = this.lugares.find(l => l.id === id);
    if (lugar) {
      return {...lugar};
    } else {
      throw new Error('Lugar no encontrado');
    }
  }
  addLugar(lugar: {titulo: string, imagen: string})
   {
    const newLugar: Lugar = {
      id: this.lugares.length + 1,
      titulo: lugar.titulo,
      imagen: lugar.imagen,
      comentarios: []
    };
    this.lugares.push(newLugar);
  }
  updateLugar(lugarActualizado: Lugar) {
    const index = this.lugares.findIndex(lugar => lugar.id === lugarActualizado.id);
    if (index !== -1) {
      this.lugares[index] = { ...lugarActualizado }; // Asegúrate de que los 
      this.lugares[index].titulo = lugarActualizado.titulo;
      this.lugares[index].imagen = lugarActualizado.imagen;
      this.lugarActualizado.next(this.lugares[index]);  // Emitir el evento de actualización
    }
  }
  addComentario(lugarId: number, comentario: Comentario) {
    const lugar = this.lugares.find(l => l.id === lugarId);
    if (lugar) {
      lugar.comentarios?.push(comentario);
      this.lugarActualizado.next(lugar);
    } else {
      throw new Error('Lugar no encontrado');
    }
  }
  deleteLugar(id: number) {
    const index = this.lugares.findIndex(lugar => lugar.id === id);
    if (index !== -1) {
      this.lugares.splice(index, 1);
      // Emitir un evento de actualización para reflejar la eliminación
      this.lugarActualizado.next(null);
    }
  }
  deleteComentario(lugarId: number, comentarioIndex: number) {
    const lugar = this.lugares.find(l => l.id === lugarId);
    if (lugar) {
      lugar.comentarios.splice(comentarioIndex, 1);
      this.lugarActualizado.next(lugar);
    } else {
      throw new Error('Lugar no encontrado');
    }
  }
}
