import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  carreraUsuario: string = ''; // Agrega esta línea

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nombreUsuario = params['nombre'] || 'Usuario';
      this.apellidoUsuario = params['apellido'] || '';
      this.carreraUsuario = params['carrera'] || ''; // Asegúrate de tener un valor predeterminado
    });
  }
}
