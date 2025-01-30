import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonButton, IonInput, LoadingController, IonItem, IonList, IonText, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';  // Importamos el router para la redirección
import { LugaresService } from 'src/app/service/lugares.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, IonCardContent, IonCardTitle, FormsModule, IonCardHeader, IonCard, IonInput, IonItem, IonList, IonInputPasswordToggle, IonButton, IonText]
})
export class LoginPage implements OnInit {

  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private lugaresService: LugaresService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando de la base de datos',
      duration: 500,
    });

    await loading.present();
    await new Promise(resolve => setTimeout(resolve, 500));
    await loading.dismiss();
  }

  login() {
    if (this.correo && this.password) {
      this.showLoading();
      this.lugaresService.loginUsuario(this.correo, this.password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);

          // Guardamos solo el token
          localStorage.setItem('token', response.usuario.token);

          // Navegar a la página de lugares
          this.router.navigate(['/lugares']);
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingrese ambos campos: correo y contraseña.';
    }
  }


}
