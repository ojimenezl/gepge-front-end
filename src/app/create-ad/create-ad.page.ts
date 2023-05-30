import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google: { maps: { places: { AutocompleteService: new () => any; }; }; };
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
  selector: 'app-create-ad',
  templateUrl: './create-ad.page.html',
  styleUrls: ['./create-ad.page.scss'],
})
export class CreateAdPage implements OnInit {
  private baseUrl = environment.apiUrl;
  showDateTimePicker = false;
  public maxDate: string;
  public minDate: string;
  public formGroup: FormGroup;
  AdForm: FormGroup;

  
  @ViewChild('dateTimePicker') dateTimePicker: any;
  @ViewChild('map',  {static: false}) mapElement: ElementRef | undefined;
  map: any;
  address:string | undefined;
  lat: string | undefined;
  long: string | undefined;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  showResults = true;
  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,public zone: NgZone,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: ['', Validators.required],
      lugarAnunciante: ['', Validators.required],
      transporte: [false],
      tiempoAnunciante: ['', Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
      nombreAnunciante: [''],
      numeroAnunciante: [''],
      postulante: [''],
    });
    {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
    this.formGroup = new FormGroup({
      lugarAnunciante: new FormControl(),
    });
  }

  ngOnInit() {
    //sessionStorage.clear();
  }

  addAd() {
    const data = this.AdForm.value;
    //console.log(data);
    data.creador = localStorage.getItem('userId') || '';
    data.nombreAnunciante= localStorage.getItem('nombre') || '';
    data.numeroAnunciante= localStorage.getItem('celular') || '';
    data.postulante = '';
    data.estado='0';
    data.EntregacodigoAnunciante="enEspera";
    data.EntregacodigoTrabajador="enEspera";

    this.http.get<Cliente>(`${this.baseUrl}/clientes/obtenerTokenCliente/${localStorage.getItem('userId')}`).subscribe(
      token => {
       // console.log("token: ",token.cliente);
        data.token=token.cliente
        this.http.post(`${this.baseUrl}/anuncios/crearAnuncio`, data).subscribe(response => {
          //console.log(response);
        });
      })

    
    this.router.navigateByUrl('/feed');
    
  }
  toggleDateTime() {
    this.showDateTimePicker = !this.showDateTimePicker;
    // this.dateTimePicker.disabled = !this.showDateTimePicker;
  }

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
  goToHome() {
    this.router.navigate(['/feed']);

  }
}
