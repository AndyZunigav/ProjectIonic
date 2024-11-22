import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta_feriados: string = 'https://api.boostr.cl';
  ruta_sedes_obtener: string = 'https://www.s2-studio.cl/api_duoc/usuario/sedes_obtener';
  ruta: string = 'https://www.s2-studio.cl/api_duoc/usuario';
  private baseURL = 'https://www.s2-studio.cl/api_duoc/usuario';

  constructor(private http: HttpClient) { }

  obtenerFeriados() {  
    return this.http.get(this.ruta_feriados + '/holidays.json').pipe();
  }

  obtenerSede() {
    return this.http.get(this.ruta_sedes_obtener).pipe();
  }

  // Método para crear un usuario
  crearUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    let objeto = {
      correo: correo,
      contrasena: contrasena,
      nombre: nombre,
      apellido: apellido,
      carrera: carrera
    };

    // Llamada POST a la API para almacenar el usuario
    return this.http.post(`${this.ruta}/usuario_almacenar`, objeto).pipe();
  }

  // Método para login
  login(correo: string, contrasena: string) {
    let objeto = {
      correo: correo,
      contrasena: contrasena
    };

    // Llamada POST a la API para login
    return this.http.post(`${this.ruta}/usuario_login`, objeto).pipe();
  }

  // Método para modificar contraseña y carrera
  modificarUsuario(correo: string, contrasena: string, carrera: string) {
    let objeto = {
      correo: correo,
      contrasena: contrasena,
      carrera: carrera
    };

    // Llamada PATCH a la API para modificar el usuario
    return this.http.patch(`${this.ruta}/usuario_modificar`, objeto).pipe();
  }

}