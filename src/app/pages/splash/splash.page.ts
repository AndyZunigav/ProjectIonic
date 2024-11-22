import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private db: DbService) { }

  async ngOnInit() {
    try {
      console.log("FSR: Iniciando SplashPage...");
      await this.db.crearTablaSesion(); // Asegurarte de que la tabla está creada
  
      // Recuperar la sesión guardada
      const sesion = await this.db.verificarSesion();
      console.log("FSR: Sesión recuperada de SQLite:", sesion);
  
      if (sesion) {
        console.log("FSR: Intentando iniciar sesión automáticamente...");
  
        // Intentar iniciar sesión con la API usando correo y contraseña
        const datos = this.api.login(sesion.correo, sesion.contrasena);
        const respuesta: any = await lastValueFrom(datos);
  
        if (respuesta?.status === 'success') {
          const usuario = respuesta.usuario;
          console.log("FSR: Login automático exitoso:", usuario);
  
          // Redirigir al usuario a la página principal con los datos recuperados
          this.router.navigate(['principal'], {
            queryParams: {
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              carrera: usuario.carrera,
              correo: usuario.correo,
            },
          });
        } else {
          console.log("FSR: Falló el login automático:", respuesta.message);
          this.router.navigate(['login']); // Redirigir al login si las credenciales no son válidas
        }
      } else {
        console.log("FSR: No hay sesión guardada. Redirigiendo a login...");
        this.router.navigate(['login']);
      }
    } catch (error) {
      console.error("FSR: Error en SplashPage:", JSON.stringify(error));
      console.log("FSR: Redirigiendo a login por error...");
      this.router.navigate(['login']);
    }
  
  
}
