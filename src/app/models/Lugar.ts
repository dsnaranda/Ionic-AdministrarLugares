export interface Comentario {
  name: string;
  comentario: string;
}

export interface Lugar {
  id: string;
  titulo: string;
  imagen: string;
  comentarios: Comentario[];
}