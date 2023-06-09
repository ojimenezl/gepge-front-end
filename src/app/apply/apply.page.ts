import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google: { maps: { places: { AutocompleteService: new () => any; }; }; };

interface Anuncio {
  _id: string;
  titulo: string;
  descripcion: string;
  precioAnunciante: number;
  precioTrabajador: number;
  lugarAnunciante: string;
  lugarTrabajador: string;
  transporte: string;
  tiempoAnunciante: string;
  tiempoTrabajador: string;
  tipoPago:string;
  creador: string;
  nombreAnunciante:string;
  nombreTrabajador:string;
  idAnuncioPrincipal:String;
}
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
    fechaCreacion: string;
    token:string;
    __v: number;
  }[];
}
interface Cliente {
  mensaje: string;
  cliente: {
    nombre: string;
    email: string;
    cedula: string;
    celular: string;
    ciudad: string;
    fechaNacimiento: string;
    //apellido: String,
    //edad: Number,
    password: string;
    fechaCreacion: string;
    __v: number;
  }[];
}
@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
})
export class ApplyPage implements OnInit {
  private baseUrl = environment.apiUrl;
  private keyFCM =environment.keyFCM;

  ad: Anuncio;
  ads: any[] = [];

  AdForm: FormGroup;
  anuncioId: string = '';
  nombreTrabajador: string = '';
  numeroTrabajador: string = '';
  id_new_Anuncio: string ='';
  _idAnuncioHijo: string ='';
  @ViewChild('map',  {static: false}) mapElement: ElementRef | undefined;
  map: any;
  address:string | undefined;
  lat: string | undefined;
  long: string | undefined;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  estaDeAcuerdo = true;
  precioTrabajador: boolean = true;
  GoogleAutocomplete: any;
  showResults = true;
  mostrarPrecio: boolean = true;
  mostrarHora: boolean = true;
  //tiempoTrabajador={ tiempoTrabajador: '10:00' };
  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,public zone: NgZone,private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
    //console.log("arriba ",this.ad.tiempoTrabajador);
    
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
      precioTrabajador: [this.ad.precioAnunciante, Validators.required],
      lugarAnunciante: ['', Validators.required],
      lugarTrabajador: ['', Validators.required],
      precioTransporte: [''],
      tiempoAnunciante: ['', Validators.required],
      tiempoTrabajador: [this.ad.tiempoAnunciante, Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
      nombreTrabajador: [''],
    });
    {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }
    this.ad = {} as Anuncio;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['ad']) {
        this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']; // obtener el ID del anuncio
        this.nombreTrabajador = this.router.getCurrentNavigation()?.extras?.state?.['nombreTrabajador']; // obtener el ID del anuncio
        this.numeroTrabajador = this.router.getCurrentNavigation()?.extras?.state?.['numeroTrabajador']; 
        this.AdForm.patchValue({
          creador: this.ad.creador,
          titulo: this.ad.titulo,
          descripcion: this.ad.descripcion,
          precioAnunciante: this.ad.precioAnunciante,
          lugarAnunciante: this.ad.lugarAnunciante,
          transporte: this.ad.transporte,
          tiempoAnunciante: this.ad.tiempoAnunciante,
          tipoPago: this.ad.tipoPago,
          //tiempoTrabajador:this.ad.tiempoTrabajador
          //nombreTrabajador:this.nombreTrabajador
        });
      }
    });
  }

  addAd() {
    
    const data = this.AdForm.value;
    //console.log('aqui ',data);

    
    //mi anuncio al que postule
    data.estado = '0';
    data.postulante = localStorage.getItem('userId') || '';
    data.nombreTrabajador = this.nombreTrabajador;
    data.numeroTrabajador = this.numeroTrabajador;
    data.idAnuncioPrincipal = this.ad._id;
    
    this.http.post(`${this.baseUrl}/anuncios/crearAnuncio`, data).pipe(
      switchMap((response: any) => {
        let jsonData = response.cliente;
        this.id_new_Anuncio = jsonData._id;
        localStorage.setItem('idAnuncioHijo', this.id_new_Anuncio);
        //console.log("aquiii new", this.id_new_Anuncio);
    
        data.correoTrabajador = localStorage.getItem('userId') || '';
        data.correoAnunciante = this.ad.creador;
        data.tipo = "Postulante";
        data.para = this.ad.creador;
        data._idAnuncio = this.ad._id;
        data._idAnuncioHijo = localStorage.getItem('idAnuncioHijo') || '';
       // console.log('envio notificaion al anunciante ', localStorage.getItem('idAnuncioHijo') || '');
        ///

        this.http.get<Cliente>(`${this.baseUrl}/clientes/obtenerTokenCliente/${this.ad.creador}`).subscribe(
          gettoken => {
            //console.log(gettoken.cliente);
            
        const token = gettoken.cliente;
        const body = {
          to: token,
          notification: {
            title: 'Nuevo Postulante',
            body: this.nombreTrabajador+' ha postulado para el puesto '+this.ad.titulo+' que has publicado'
          }
        };
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.keyFCM
        });
        this.http.post('https://fcm.googleapis.com/fcm/send', body, { headers }).subscribe(response => {
          //console.log('La notificación push fue enviada correctamente', response);
        }, error => {
          console.error('Error al enviar la notificación push', error);
        });
      })
        ///
        return this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, data);
        
      })
    ).subscribe(response => {
      //console.log(response);
    });
    


    data.idAnuncioPrincipal = '';

    data.postulante=""
    //cambio estado al anuncio ya que hay un postulado
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.ad._id}`, data).subscribe(response => {
      
    //console.log(this.id_new_Anuncio);
    });
    this.router.navigateByUrl('/feed');
    
  }

  // togglePrecio() {
  //   this.estaDeAcuerdo = !this.estaDeAcuerdo;
  //   if (this.estaDeAcuerdo) {
  //     this.AdForm.get('precioTrabajador')?.disable();// Desactivamos el control de precioTrabajador
  //   } else {
  //     this.AdForm.get('precioTrabajador')?.enable(); // Activamos el control de precioTrabajador
  //   }
  // }
  //AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      this.showResults = false; // ocultar la lista de sugerencias
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions: any[], status: any) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction: any) => {
          this.autocompleteItems.push(prediction);
        });
      });
      this.showResults = true; // mostrar la lista de sugerencias
    });
  }

  
  //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  SelectSearchResult(item: { place_id: any, description: string }) {   
    this.autocomplete.input = item.description;
    this.placeid = item.place_id;
    this.showResults = false;
  }
  
  
  
  //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
  

}
