import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';  // Importa MenuController para controlar el menú

interface ModificarUsuarioResponse {
  status: string;
  message: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  lista_feriados: any[] = [];
  lista_sede: any[] = [];
  nombreUsuario: string = '';  // Nombre del usuario, solo para visualizar
  apellidoUsuario: string = '';  // Apellido del usuario, solo para visualizar
  carreraUsuario: string = '';  // Campo modificable
  correoUsuario: string = '';  // Campo modificable
  contrasenaUsuario: string = '';  // Campo modificable
  mostrarSedesFlag: boolean = false;
  mostrarFeriadosFlag: boolean = false;
  mostrarCuentaFlag: boolean = false; // Flag para mostrar la cuenta en el menú
  nuevaContrasena: string = '';  // Campo para modificar la contraseña


  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private menu: MenuController, private alertController: AlertController ) { }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nombreUsuario = params['nombre'];
      this.apellidoUsuario = params['apellido'];
      this.carreraUsuario = params['carrera'];
      this.correoUsuario = params['correo'];
    });
    



    this.obtenerFeriados();
    this.obtenerSede();  // Cargar datos del usuario al inicializar
  }

  async obtenerFeriados() {
    this.lista_feriados = [];
    let datos = this.api.obtenerFeriados();
    let respuesta = await lastValueFrom(datos);

    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    for(let x = 0; x < json.data.length; x++) {
      let feriado: any = {};
      feriado.nombre = json.data[x].title;
      feriado.fecha = json.data[x].date;
      this.lista_feriados.push(feriado);
    }
  }

  async obtenerSede() {
    this.lista_sede = [];
    let datos = this.api.obtenerSede();
    let respuesta: any = await lastValueFrom(datos);
    let sedes: any[] = Array.isArray(respuesta) ? respuesta[0] : [];

    for (let x = 0; x < sedes.length; x++) {
      let sede: any = {};
      sede.nombre = sedes[x].NOMBRE;
      sede.direccion = sedes[x].DIRECCION;
      sede.telefono = sedes[x].TELEFONO;
      sede.horario = sedes[x].HORARIO_ATENCION;
      sede.imagen = sedes[x].IMAGEN;
      this.lista_sede.push(sede);
    }
  }


  // Método para modificar el correo, carrera y contraseña del usuario


  async mostrarSedes() {
    this.mostrarSedesFlag = true;
    this.mostrarFeriadosFlag = false;  // Oculta los feriados
    this.mostrarCuentaFlag = false;   // Activa la visualización de sedes
    await this.menu.close();  // Cierra el menú automáticamente
  }

  async mostrarFeriados() {
    this.mostrarFeriadosFlag = true;
    this.mostrarSedesFlag = false;     // Oculta las sedes
    this.mostrarCuentaFlag = false;  // Activa la visualización de feriados
    await this.menu.close();  // Cierra el menú automáticamente
  }

  // Mostrar cuenta del usuario para modificar correo, carrera y contraseña
  async mostrarCuenta() {
    this.mostrarCuentaFlag = true;
    this.mostrarSedesFlag = false;     // Oculta las sedes
    this.mostrarFeriadosFlag = false;  // Activa la visualización de la cuenta
    await this.menu.close();  // Cierra el menú automáticamente
  }


    // Método para modificar carrera y contraseña
    async modificarUsuario() {
      try {
        let respuesta: any = await lastValueFrom(this.api.modificarUsuario(this.correoUsuario, this.nuevaContrasena, this.carreraUsuario));
        if (respuesta.status === 'success') {
          console.log(respuesta.message);
          this.mostrarAlerta('FSR: GUARDANDO CAMBIOS, repuesta de la api', respuesta.message);
          this.cerrarMenu();
        } else {
          console.log( respuesta.message);
          this.mostrarAlerta('FSR: Recuerda', respuesta.message);
        }
      } catch (error) {
        
        console.error('FSR: Error al modificar usuario:', error);
        
      }
    }

    async mostrarAlerta(titulo: string, mensaje: string) {
      const alert = await this.alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [{
          text: 'OK',
          handler: () => {
            // Al presionar 'OK', cerramos el menú
            this.cerrarMenu();
          }
        }]
      });
      await alert.present();
    }
  
    // Método para cerrar el menú
    cerrarMenu() {
      this.menu.isOpen().then((isOpen) => {
        if (isOpen) {
          this.menu.close().then(() => {
            console.log("Menú cerrado correctamente");
          }).catch((error) => {
            console.error("Error al cerrar el menú:", error);
          });
        } else {
          console.log("El menú ya está cerrado");
        }
      });
    
    }

}