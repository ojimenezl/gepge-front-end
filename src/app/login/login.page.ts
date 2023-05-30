import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthService, SocialUser, SocialAuthServiceConfig } from 'angularx-social-login';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  private baseUrl = environment.apiUrl;

  loginForm: FormGroup;
  socialUser: SocialUser = {} as SocialUser;
  ads: string = '';
  res:string='';


  constructor(
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: SocialAuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  login() {
    const data = this.loginForm.value;
    //console.log(data);

    this.http.post(`${this.baseUrl}/inicio-sesion/`, data).subscribe(response => {
      const res=JSON.parse(JSON.stringify(response));
      if(res.mensaje == 'Inicio de Sesion Exitosa!'){
        localStorage.setItem('userId', data.email);
       // console.log('para envio UserId',data.email,'<--');      
          this.http.get(`${this.baseUrl}/anuncios/obtenerAnuncioPorCorreo?correo=${data.email}`)
            .subscribe(response => {            
              this.ads = JSON.stringify(response);
              const miObjetoParseado = JSON.parse(this.ads);
              const miPropiedad = miObjetoParseado;
            //  console.log(miPropiedad.encontrado);
              localStorage.setItem('accesoPagoEntreUsuarios', miPropiedad.encontrado.toString());
              if(miPropiedad.encontrado){
              this.router.navigate(['/feed']);
              }else{
                this.router.navigateByUrl('/acceso');
              }           
            });
      }else{
        alert(res.mensaje)
      }

    });
    
  }

  goToSignup() {
    this.router.navigateByUrl('/sign-up');
  }
  goToNoti(){
    this.router.navigateByUrl('/home');
  }


  
}

