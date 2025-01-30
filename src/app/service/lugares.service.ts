import { Injectable } from '@angular/core';
import { Comentario, Lugar } from '../models/Lugar';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  private apiUrl = 'http://localhost:3800/api';  

  private lugarActualizado = new Subject<Lugar | null>();
  lugarActualizado$ = this.lugarActualizado.asObservable();

  constructor(private http: HttpClient) { }

  getLugares(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.apiUrl}/lugares`);
  }

  getLugar(id: string): Observable<Lugar> {
    return this.http.get<Lugar>(`${this.apiUrl}/lugar/${id}`);
  }

  addLugar(lugar: { titulo: string; imagen: string }): Observable<Lugar> {
    return this.http.post<Lugar>(`${this.apiUrl}/lugar`, lugar);
  }

  updateLugar(id: string, lugarActualizado: Lugar): Observable<Lugar> {
    return this.http.put<Lugar>(`${this.apiUrl}/lugar/${id}`, lugarActualizado);
  }

  deleteLugar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/lugar/${id}`);
  }

  addComentario(lugarId: string, comentario: Comentario): Observable<Lugar> {
    return this.http.post<Lugar>(`${this.apiUrl}/lugar/${lugarId}/comentarios`, comentario);
  }

  deleteComentario(lugarId: string, comentarioIndex: number): Observable<Lugar> {
    return this.http.delete<Lugar>(`${this.apiUrl}/lugar/${lugarId}/comentarios/${comentarioIndex}`);
  }

  loginUsuario(correo: string, password: string) {
    return this.http.post<any>('http://localhost:3800/api/login', { correo, password })
      .pipe(
        tap(response => {
          if (response && response.usuario) {
            // Almacena tanto el token como el nombre
            localStorage.setItem('token', response.usuario._id); // Usamos _id o token
            localStorage.setItem('nombre', response.usuario.nombre); // Almacena el nombre
          }
        })
      );
  }
  
  
}