import { Component, OnInit, ViewChild,ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, PushNotificationSchema, PushNotificationToken } from '@capacitor/push-notifications';
import { AlertController } from '@ionic/angular';

//google maps
declare var google: { maps: { places: { AutocompleteService: new () => any; }; }; };
//
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  private baseUrl = environment.apiUrl;
  signUpForm: FormGroup;
  
  dias:any[] = [];
  meses:any[] = [];
  year:any[] = [];
  token:string="";
  
  //google maps construcor
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
  //
  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,public zone: NgZone,public alertController: AlertController,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    
    this.signUpForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      cedula:['', Validators.required],
      celular:['', Validators.required],
      ciudad:['', Validators.required],
      year:['', Validators.required],
      mes:['', Validators.required],
      dia:['', Validators.required],
      token:[''],
      
      //confirmPassword: ['', Validators.required],
    });

    //google maps
    {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }
    //

  }

  ngOnInit() {
    this.dias = Array.from({length: 31}, (_, i) => i+1);
    this.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.year = Array.from({length: 120}, (_, i) => (new Date().getFullYear() - i));

//notificaciones



  }

  registerUser() {
    const data = this.signUpForm.value;

     //notifications
            PushNotifications.requestPermissions().then((result)=>{
            if(result.receive)
            {
              PushNotifications.register();
            }
            })
      
            PushNotifications.addListener('registration',
            (token:PushNotificationToken)=>{
             // console.log("token, ",token);
              
                  data.token = token.value
                  data.fechaNacimiento=data.dia+'-'+data.mes+'-'+data.year;
                  //console.log(data.fechaNacimiento);
              
                  this.http.post(`${this.baseUrl}/clientes/crearCliente`, data).subscribe(response => {
                   // console.log(response);
                  });
              
              
              
                  this.router.navigate(['/login']);

            })


 
  }


  async presentAlert(notificacion: { title: string; body: string; }) {
    const alert = await this.alertController.create({
      header: ""+notificacion.title,
      message: ""+notificacion.body,
      buttons: ['OK']
    });
    await alert.present();
  }


  ///busqueda google maps
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
