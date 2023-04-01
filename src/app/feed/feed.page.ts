import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//import { CreateAdPage } from '../create-ad/create-ad.page';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';
import { MenuController } from '@ionic/angular';
import { environment } from '../../environments/environment';

interface ApiResponseNotification {
  mensaje: string;
  clientes: {
    _id: string;
    descripcion: string;
    precio: number;
    para: string;
    lugar: string;
    fechaCreacion: string;
    correoAnunciante:string;
    correoTrabajador:string;
    __v: number;
  }[];
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
    __v: number;
  }[];
}
interface Anuncio {
  _id: string;
  titulo: string;
  descripcion: string;
  precioAnunciante: number;
  lugarAnunciante: string;
  creador: string;
  postulante:string;

}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  private baseUrl = environment.apiUrl;
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  enEspera:  any[] = [];
  newNotificationsCount = 0;
//  private isPageLoaded: boolean = false;
  searchText: string = '';
  darkModeEnabled = false;


  constructor(private menuController: MenuController,private modalController: ModalController,private navCtrl: NavController, private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';
    console.log("recive userid ",this.userId,"<--");
    
  }

  ngOnInit() {   
    this.getAds();
    this.contNotifications();
  }
  ionViewWillEnter(){
    this.getAds();
    this.contNotifications();
  }
  getAds() {
    this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncios`).subscribe(
      data => {
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        this.enEspera  = this.ads.filter(ad => ad.idAnuncioPrincipal && ad.postulante === this.userId);
        console.log('para if ',this.enEspera);
        if(this.enEspera.length>0){        
          this.enEspera.forEach(res => {
          console.log('en Espera',res);
          this.ads  = this.ads.filter(ad => ad.postulante === '' && ad.estado === '0' || ad.postulante === this.userId);
          this.ads = this.ads.filter(ad =>  ad._id !== ad.idAnuncioPrincipal);

          console.log('feedconespera',this.ads);
        });
        }else{
          console.log("aqui");
          
          this.ads  = this.ads.filter(ad => ad.postulante === '' && ad.estado === '0' );
          console.log('feed',this.ads);
        }
       
      },
      error => {
        console.log(error);
      }
    );
    
  }

  goToCreateAd() {
    this.navCtrl.navigateForward('/create-ad');
  }
  goToMiPerfil(){
    this.navCtrl.navigateForward('/mi-perfil');
  }
  goToMisPublicaciones() {
    this.navCtrl.navigateForward('/mis-publicaciones');
  }
  goToMisTrabajos() {
    this.navCtrl.navigateForward('/mis-trabajos');
  }
  goToNotificaciones(){
    this.showNotifications();
  }
  login(){
    this.router.navigateByUrl('/login');
  }
  editAd(ad: Anuncio){
       console.log("listo",ad);       
        const navigationExtras: NavigationExtras = {
          state: {
            ad: ad,
            anuncioId: ad._id 
          }
        };
    this.router.navigate(['/edit-ad'], navigationExtras);
  }
  aplicar(ad: Anuncio){
    console.log("listo",ad);       
     const navigationExtras: NavigationExtras = {
       state: {
         ad: ad,
         anuncioId: ad._id 
       }
     };
    this.router.navigate(['/apply'], navigationExtras);
}
  eliminateAd(ad: Anuncio){
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      this.http.delete(`${this.baseUrl}/anuncios/eliminarAnuncio/${ad._id}`).subscribe(
        response => {
          console.log(response);
          // Actualizar la lista de anuncios después de la eliminación
          this.getAds();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  async showNotifications() {
    const modal = await this.modalController.create({
      component: NotificationPage,
    });
    return await modal.present();
  }
  contNotifications() {
    this.http.get<ApiResponseNotification>(`${this.baseUrl}/notificaciones/obtenerNotificacion`).subscribe(
      data => {
        const totalNotifications  = data.clientes.filter(ad => ad.para === this.userId);
        console.log('conteo ',totalNotifications);
        this.newNotificationsCount=totalNotifications.length;
      },
      error => {
        console.log(error);
      }
    );
  }
  onSearchInput(event: any) {
    const searchTerm = event.target.value.toLowerCase();
  
    if (searchTerm === '') {
      this.getAds();
    } else {
      this.ads = this.ads.filter((ad) => {
        const title = ad.titulo.toLowerCase();
        const location = ad.lugarAnunciante.toLowerCase();
    
        return title.includes(searchTerm) || location.includes(searchTerm);
      });
    }
  }
  
  async openMenu() {
    await this.menuController.open();
  }


    toggleDarkMode() {
      this.darkModeEnabled = !this.darkModeEnabled;
      
      // Obtener los elementos que se deben cambiar de color
      const body = document.body;
      const content = document.querySelector('ion-content');
      const palabras = document.querySelectorAll('p');
      const headers = document.querySelectorAll('.header-color');
      const headersCards = document.querySelectorAll('.header-color-card');
      const cards = document.querySelectorAll('.my-card');
      const menuItems = document.querySelectorAll('.menu-item');
      

      body.classList.toggle('dark', this.darkModeEnabled);
      if (headers) {
        headers.forEach(header => {
          header.classList.toggle('header-dark', this.darkModeEnabled);
        });
      } 
      if (headersCards) {
        headersCards.forEach(headersCard => {
          headersCard.classList.toggle('header-card-dark', this.darkModeEnabled);
        });
      }    
      if (content) {
        content.classList.toggle('dark', this.darkModeEnabled);
      }
      if (palabras) {
        palabras.forEach(palabra => {
          palabra.classList.toggle('p-dark', this.darkModeEnabled);
        });
      }
      if (cards) {
      cards.forEach(card => {
        card.classList.toggle('card-dark', this.darkModeEnabled);
      });
      }
      if (menuItems) {
        console.log("aqui btn ",menuItems);
        
        menuItems.forEach(menuItem => {
          menuItem.classList.toggle('menu-item-dark', this.darkModeEnabled);
        });
        }

    }
    
    
}
