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
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log(this.socialUser);
      if (this.socialUser != null) {
        this.nativeStorage.setItem('google_user', {
          name: this.socialUser.name,
          email: this.socialUser.email,
          picture: this.socialUser.photoUrl,
        }).then(() => {
          console.log('Stored item!');
        }, error => console.error('Error storing item', error));
      }
    });
  }

  login() {
    const data = this.loginForm.value;
    console.log(data);

    this.http.post(`${this.baseUrl}/inicio-sesion/`, data).subscribe(response => {
      console.log(data.email);
      localStorage.setItem('userId', data.email);
      console.log('para envio UserId',data.email,'<--');
     
        this.http.get(`${this.baseUrl}/anuncios/obtenerAnuncioPorCorreo?correo=${data.email}`)
          .subscribe(response => {            
            this.ads = JSON.stringify(response);
            const miObjetoParseado = JSON.parse(this.ads);
            const miPropiedad = miObjetoParseado;
            console.log(miPropiedad.encontrado);
            localStorage.setItem('accesoPagoEntreUsuarios', miPropiedad.encontrado.toString());
            if(miPropiedad.encontrado){
            this.router.navigate(['/feed']);
            }else{
              this.router.navigateByUrl('/acceso');
            }
            
            
          });
      

      



    });
    
  }

  goToSignup() {
    this.router.navigateByUrl('/sign-up');
  }

  async loginWithGoogle(): Promise<void> {
    try {
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
        console.log(user);
        this.socialUser = user;
        localStorage.setItem('userId', user.email);
        this.router.navigateByUrl('/feed');
      });
    } catch (error) {
      console.error(error);
    }
  }
  
}

