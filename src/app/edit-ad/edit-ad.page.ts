import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google: { maps: { places: { AutocompleteService: new () => any; }; }; };

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
  showDateTimePicker = false;
  // public maxDate: string;
  // public minDate: string;
  public formGroup: FormGroup;
  ad: Anuncio;
  AdForm: FormGroup;
  anuncioId: string = '';
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
  mostrarLugar: boolean = false;

  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,public zone: NgZone,private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
    console.log(this.ad.lugarAnunciante);
    
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
      lugarAnunciante: [this.ad.lugarAnunciante, Validators.required],
      transporte: [''],
      tiempoAnunciante: ['', Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
    });
    {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }
    // const today = new Date();
    // this.minDate = today.toISOString().split('T')[0];
    // this.maxDate = today.toISOString().split('T')[0];
    this.formGroup = new FormGroup({
      lugarAnunciante: new FormControl(),
    });
    this.ad = {} as Anuncio;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['ad']) {
        this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId'];
        this.AdForm.patchValue({
          titulo: this.ad.titulo,
          descripcion: this.ad.descripcion,
          precioAnunciante: this.ad.precioAnunciante,
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
  

}