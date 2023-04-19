import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, PushNotificationSchema, PushNotificationToken } from '@capacitor/push-notifications';
import { AlertController } from '@ionic/angular';


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

  constructor(public alertController: AlertController,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    
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
              console.log("token, ",token);
              
                  data.token = token.value
                  data.fechaNacimiento=data.dia+'-'+data.mes+'-'+data.year;
                  console.log(data.fechaNacimiento);
              
                  this.http.post(`${this.baseUrl}/clientes/crearCliente`, data).subscribe(response => {
                    console.log(response);
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
}
