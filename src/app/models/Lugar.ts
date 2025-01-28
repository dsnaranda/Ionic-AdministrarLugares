export interface Comentario {
    name: string;
    comentario: string;
  }

  export interface Lugar {
    id: number;
    titulo: string;
    imagen: string;
    comentarios: Comentario [];
  }