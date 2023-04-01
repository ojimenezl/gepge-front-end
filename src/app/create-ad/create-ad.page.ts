import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.page.html',
  styleUrls: ['./create-ad.page.scss'],
})
export class CreateAdPage implements OnInit {
  private baseUrl = environment.apiUrl;
  AdForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
      lugarAnunciante: ['', Validators.required],
      transporte: [false],
      tiempoAnunciante: ['', Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
      postulante: [''],
    });
  }

  ngOnInit() {
    //sessionStorage.clear();
  }

  addAd() {
    const data = this.AdForm.value;
    console.log(data);
    data.creador = localStorage.getItem('userId') || '';
    data.postulante = '';
    data.estado='0'
    this.http.post(`${this.baseUrl}/anuncios/crearAnuncio`, data).subscribe(response => {
      console.log(response);
    });
    this.router.navigateByUrl('/feed');
    
  }

}
