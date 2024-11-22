import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  // Método para abrir la base de datos
  async abrirDB() {
    if (!this.db) {
      this.db = await this.sqlite.create({
        name: "datos.db",
        location: "default"
      });
      console.log("FSR: Base de datos abierta correctamente");
    }
  }

  // Método para crear la tabla de sesión
  async crearTablaSesion() {
    try {
      console.log("FSR: Intentando crear la tabla SESION...");
      await this.abrirDB();
      await this.db?.executeSql(
        "CREATE TABLE IF NOT EXISTS SESION (MAIL VARCHAR(75), PASS VARCHAR(75))",
        []
      );
      console.log("FSR: Tabla SESION creada correctamente");
    } catch (error) {
      console.error("FSR: Error al crear la tabla SESION:", JSON.stringify(error));
    }
  }
  
  

  // Método para almacenar la sesión (correo y contraseña)
  async sesionAlmacenar(correo: string, contrasena: string) {
    await this.abrirDB();
    try {
      await this.db?.executeSql(
        "INSERT OR REPLACE INTO SESION (MAIL, PASS) VALUES (?, ?)",
        [correo, contrasena]
      );
      console.log("FSR: Sesión almacenada correctamente");
    } catch (error) {
      console.log("FSR: Error al almacenar la sesión: " + JSON.stringify(error));
    }
  }

  // Método para verificar si existe una sesión activa
  async verificarSesion(): Promise<{ correo: string; contrasena: string } | null> {
    try {
      await this.abrirDB();
      const respuesta = await this.db?.executeSql("SELECT MAIL, PASS FROM SESION LIMIT 1", []);
      console.log("FSR: Verificar sesión respuesta:", respuesta);
  
      if (respuesta?.rows.length > 0) {
        const correo = respuesta.rows.item(0).MAIL;
        const contrasena = respuesta.rows.item(0).PASS;
        console.log("FSR: Sesión encontrada:", { correo, contrasena });
        return { correo, contrasena };
      }
  
      console.log("FSR: No se encontró sesión activa");
      return null;
    } catch (error) {
      console.error("FSR: Error al verificar sesión:", JSON.stringify(error));
      throw error;
    }
  }

  // Método para cerrar la sesión
  async cerrarSesion() {
    await this.abrirDB();
    await this.db?.executeSql("DELETE FROM SESION", []);
    console.log("FSR: Sesión cerrada correctamente");
  }
  // Método para crear la tabla de usuarios
async crearTablaUsuario() {
  await this.abrirDB();
  await this.db?.executeSql(
    "CREATE TABLE IF NOT EXISTS USUARIOS (MAIL VARCHAR(75) PRIMARY KEY, PASS VARCHAR(75), NOMBRE VARCHAR(50), APELLIDO VARCHAR(50), CARRERA VARCHAR(100))",
    []
  );
  console.log("FSR: Tabla USUARIOS creada correctamente");
}

// Método para almacenar un usuario
async usuarioAlmacenar(mail: string, pass: string, nombre: string, apellido: string, carrera: string) {
  await this.abrirDB();
  try {
    await this.db?.executeSql(
      "INSERT OR REPLACE INTO USUARIOS (MAIL, PASS, NOMBRE, APELLIDO, CARRERA) VALUES (?, ?, ?, ?, ?)",
      [mail, pass, nombre, apellido, carrera]
    );
    console.log("FSR: Usuario almacenado correctamente");
  } catch (error) {
    console.log("FSR: Error al almacenar el usuario: " + JSON.stringify(error));
  }
}

  
  
}
