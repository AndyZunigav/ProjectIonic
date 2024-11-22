import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  isAlertOpen: boolean = false;
  alertButtons = ['OK'];
  alertMessage: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private db: DbService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    try {
      console.log('FSR: Recuperando datos de sesión...');
      const sesion = await this.db.verificarSesion(); // Recuperar sesión desde SQLite

      if (sesion) {
        // Rellenar los campos con correo y contraseña
        this.mdl_correo = sesion.correo;
        this.mdl_contrasena= sesion.contrasena;

        console.log('FSR: Intentando inicio de sesión automático...');
        // Intentar login automático
        this.login(); // Realizar el inicio de sesión con los datos rellenados
      } else {
        console.log('FSR: No se encontró sesión guardada.');
      }
    } catch (error) {
      console.error('FSR: Error al recuperar la sesión:', error);
    }
  }

  async login() {
    try {
        let datos = this.api.login(this.mdl_correo, this.mdl_contrasena);
        let respuesta: any = await lastValueFrom(datos);

        console.log("Respuesta completa de la API:", respuesta); // Para depurar la respuesta

        if (respuesta?.status === 'success') {
            console.log("FSR: Credenciales válidas en la API");

            const usuario = respuesta.usuario;

            // Guardar datos del usuario en el almacenamiento
            await this.storage.set('usuario', {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                carrera: usuario.carrera,
            });
            console.log("FSR: Datos del usuario guardados en el almacenamiento");

            // Mostrar mensaje de bienvenida
            this.mostrarAlerta('Bienvenido', respuesta.message);

            // Guardar sesión en la base de datos local
            await this.db.sesionAlmacenar(this.mdl_correo);
            console.log("FSR: Sesión almacenada en la base de datos local");

            // Navegar a la página principal con datos del usuario
            this.router.navigate(['principal'], {
                queryParams: {
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    carrera: usuario.carrera,
                    correo: usuario.correo
                },
            });
        } else {
            console.log("FSR: Credenciales inválidas en la API");
            this.mostrarAlerta('Recuerda', 'Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
        this.mostrarAlerta('Error', 'Error en el login');
    }
}

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
