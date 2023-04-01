import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Anuncio {
  _id: string;
  titulo: string;
  descripcion: string;
  precioAnunciante: number;
  lugarAnunciante: string;
  transporte: string;
  tiempoAnunciante: string;
  tipoPago:string;
  creador: string;
}


@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.page.html',
  styleUrls: ['./edit-ad.page.scss'],
})
export class EditAdPage implements OnInit {
  private baseUrl = environment.apiUrl;
  ad: Anuncio;
  AdForm: FormGroup;
  anuncioId: string = '';
  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
      lugarAnunciante: ['', Validators.required],
      transporte: [''],
      tiempoAnunciante: ['', Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
    });
    this.ad = {} as Anuncio;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['ad']) {
        this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']; // obtener el ID del anuncio
        this.AdForm.patchValue({
          titulo: this.ad.titulo,
          descripcion: this.ad.descripcion,
          precioAnunciante: this.ad.precioAnunciante,
          lugarAnunciante: this.ad.lugarAnunciante,
          transporte: this.ad.transporte,
          tiempoAnunciante: this.ad.tiempoAnunciante,
          tipoPago: this.ad.tipoPago,

        });
      }
    });
  }

  addAd() {
    const data = this.AdForm.value;
    console.log(this.anuncioId); // imprimir el ID del anuncio
    data.creador = localStorage.getItem('userId') || '';
  
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.anuncioId}`, data).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/feed');
      
    });
  }
  

}
