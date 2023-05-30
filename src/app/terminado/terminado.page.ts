import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MensajesPopPage } from '../mensajes-pop/mensajes-pop.page';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ApiResponse {
  mensaje: string;
  clientes: {
    _id: string;
    creador: string;
    postulante:string;
    titulo: string;
    descripcion: string;
    precioAnunciante: number;
    lugarAnunciante: string;
    transporte: string;
    tiempoAnunciante: string;
    tipoPago: string;
    codigoTrabajador:string;
    fechaCreacion: string;
    __v: number;
  }[];
}
@Component({
  selector: 'app-terminado',
  templateUrl: './terminado.page.html',
  styleUrls: ['./terminado.page.scss'],
})
export class TerminadoPage implements OnInit {
  private baseUrl = environment.apiUrl;
  
  anuncioId: string = '';
  codigoObj: any[] = [];
  codigo: string = '';
  ads: string = '';
  tipoPago: string = '';

  AdForm: FormGroup;
  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private router: Router,private modalController: ModalController,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({

      // digit1:['', Validators.required],
      // digit2:['', Validators.required],
      // digit3:['', Validators.required],
      // digit4:['', Validators.required],
      // digit5:['', Validators.required],
      trabajoCompleto: [true],
      trabajoATiempo: [true],
      tipoPago: ['', Validators.required],
      creador: [''],
      postulante: [''],
    });
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']) {
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']; // obtener el ID del anuncio
        this.tipoPago = this.router.getCurrentNavigation()?.extras?.state?.['tipoPago']; // obtener el ID del anuncio
        
        if (this.AdForm) {
          this.AdForm.get('tipoPago')?.setValue(this.tipoPago);
        }
      //  console.log("id trabajador",this.anuncioId);
            
        this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncio/${this.anuncioId}`).subscribe(
          data => {
            this.codigoObj  = data.clientes
            this.ads = JSON.stringify(this.codigoObj);
            const miObjetoParseado = JSON.parse(this.ads);
            const miPropiedad = miObjetoParseado;
            if (miPropiedad.hasOwnProperty('codigoTrabajador')) {
              this.codigo=miPropiedad.codigoTrabajador
              
            } else {
              console.log("El campo 'codigo' no existe en este objeto.");
              const min = 10000; // El número mínimo de 5 dígitos
              const max = 99999; // El número máximo de 5 dígitos
              const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
             // console.log(randomNumber); // Muestra el número aleatorio generado
              const data = {
                codigoTrabajador: randomNumber
              };
              this.codigo=randomNumber.toString()
              this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.anuncioId}`, data).subscribe(response => {
             //   console.log(response);                
              });
            }
          
          },
          error => {
            console.log(error);
          }
        );
      }
    });
    
    
    

  }

  addAd() {
    // const data = this.AdForm.value;
    // console.log(data);
    // data.creador = localStorage.getItem('userId') || '';
    // data.postulante = '';
    // data.estado='0'
    // this.http.post('http://localhost:3001/anuncios/crearAnuncio', data).subscribe(response => {
    //   console.log(response);
    // });
    //this.router.navigateByUrl('/feed');
    
  }
  async presentModal() {
    
    const modal = await this.modalController.create({
      component: MensajesPopPage,
      componentProps: {
        mensaje: 'Terminado',
        anuncioId:this.anuncioId
      }
    });
    return await modal.present();
  }
  goToHome() {
    this.router.navigate(['/feed']);

  }

}
