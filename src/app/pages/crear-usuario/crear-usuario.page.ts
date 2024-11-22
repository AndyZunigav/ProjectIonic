import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  mdl_mail: string = '';
  mdl_pass: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';

  constructor(private api: ApiService ,private alertController: AlertController,private router: Router, private db: DbService) { }

  ngOnInit() {

  }
 almacenarUsuario(){
    this.db.usuarioAlmacenar(this.mdl_mail, this.mdl_pass, this.mdl_nombre, this.mdl_apellido, this.mdl_carrera );
  }

  async crearUsuario() {
    try {
      // Realiza la solicitud para crear un nuevo usuario
      let datos = this.api.crearUsuario(
        this.mdl_mail, this.mdl_pass,
        this.mdl_nombre, this.mdl_apellido,
        this.mdl_carrera
      );
      let respuesta: any = await lastValueFrom(datos);

      let json_texto = JSON.stringify(respuesta);
      console.log('Respuesta de la API:', json_texto);

      if (respuesta.status === 'success') {
        console.log(respuesta.message);
        // Muestra la alerta de confirmación
        await this.mostrarAlerta('Usuario creado',respuesta.message);
        // Redirige al login
        this.router.navigate(['/login']);
      } else {
        console.log(respuesta.message);
        // Muestra alerta de error si la creación falla
        await this.mostrarAlerta('Error',respuesta.message);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      await this.mostrarAlerta('Error', 'Hubo un error en el registro. Intenta más tarde.');
    }
  }



  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}
