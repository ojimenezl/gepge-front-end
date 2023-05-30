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
    codigoAnunciante:string;
    fechaCreacion: string;
    __v: number;
  }[];
}
@Component({
  selector: 'app-recibir',
  templateUrl: './recibir.page.html',
  styleUrls: ['./recibir.page.scss'],
})
export class RecibirPage implements OnInit {
  private baseUrl = environment.apiUrl;
  anuncioId: string = '';
  codigoObj: any[] = [];
  codigo: any[] = [];
  codigopop:string = '';
  ads: string = '';
  validarCodigo: string = '';
  ingresoCodigo: string = '';
  codigoCorrecto: boolean = false;
  adsString: string = '';
  tipoPago: string = '';


  AdForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private router: Router,private modalController: ModalController,private http: HttpClient) {
    
    this.AdForm = this.formBuilder.group({

      digit1:['', Validators.required],
      digit2:['', Validators.required],
      digit3:['', Validators.required],
      digit4:['', Validators.required],
      digit5:['', Validators.required],
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

        //console.log("idd anunciante",this.tipoPago);
        
        this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncio/${this.anuncioId}`).subscribe(
          data => {
            this.codigo  = data.clientes
            this.ads = JSON.stringify(this.codigo);
            // Analizar la cadena JSON y convertirla en un objeto JavaScript
            const miObjetoParseado = JSON.parse(this.ads);
            // Acceder a la propiedad
            const miPropiedad = miObjetoParseado;
            if (miPropiedad.hasOwnProperty('codigoAnunciante')) {
              this.codigopop=miPropiedad.codigoAnunciante;
            } else {
              console.log("El campo 'codigo' no existe en este objeto.");
              const min = 10000; // El número mínimo de 5 dígitos
              const max = 99999; // El número máximo de 5 dígitos
              const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
              this.codigopop=randomNumber.toString(); // Muestra el número aleatorio generado
              const data = {
                codigoAnunciante: randomNumber
              };
              this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.anuncioId}`, data).subscribe(response => {
              //  console.log(response);                
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
   
    //this.router.navigateByUrl('/feed');
    
  }
  validar(){
    //console.log("aqui");
    
    const data = this.AdForm.value;
    this.ingresoCodigo=data.digit1.toString()+data.digit2.toString()+data.digit3.toString()+data.digit4.toString()+data.digit5.toString();
    
    
    this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncio/${this.anuncioId}`).subscribe(
      data => {
        this.codigoObj  = data.clientes
        this.ads = JSON.stringify(this.codigoObj);
        const miObjetoParseado = JSON.parse(this.ads);
        const miPropiedad = miObjetoParseado;
        if (miPropiedad.hasOwnProperty('codigoTrabajador')) {
          this.codigo=miPropiedad.codigoTrabajador   
         // console.log("propiedad",miPropiedad);

          if(this.ingresoCodigo == this.codigo.toString()){
            const dataRestrigncion ={
              EntregacodigoTrabajador:'entregado',
              EntregacodigoAnunciante:'noEntregado'
            }
            this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.anuncioId}`, dataRestrigncion).subscribe(response => {
           //   console.log(response);              
            });
            this.http.get(`${this.baseUrl}/anuncios/obtenerAnunciosPorIdAnuncioPrincipal/${this.anuncioId}`).subscribe(
              response => {
             //   console.log("anuncio hijo ",response);
                this.adsString  = JSON.stringify(response);
                const miObjetoParseado = JSON.parse(this.adsString);
                const miPropiedad = miObjetoParseado;
              //  console.log("id hijo ",miPropiedad.anuncios[0]._id);
                
                this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${miPropiedad.anuncios[0]._id}`, dataRestrigncion).subscribe(response => {
                //  console.log(response);              
                });
                
              })
            this.codigoCorrecto=true
          }else{
            this.codigoCorrecto=false

          }

        }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MensajesPopPage,
      componentProps: {
        mensaje: 'Recibido',
        codigopop:this.codigopop
      }
    });
    return await modal.present();
  }
  goToHome() {
    this.router.navigate(['/feed']);

  }

}
