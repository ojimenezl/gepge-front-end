import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { CreateAdPage } from '../create-ad/create-ad.page';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';
import { MenuController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { MensajesPopPage } from '../mensajes-pop/mensajes-pop.page';
import { RefresherEventDetail } from '@ionic/core';

import * as moment from 'moment';

interface ApiResponseNotification {
  mensaje: string;
  clientes: {
    _id: string;
    descripcion: string;
    precio: number;
    para: string;
    lugar: string;
    fechaCreacion: string;
    correoAnunciante: string;
    correoTrabajador: string;
    __v: number;
  }[];
}

interface ApiResponse {
  mensaje: string;
  clientes: {
    _id: string;
    creador: string;
    //    nombreTrabajador: string;
    postulante: string;
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
  postulante: string;

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
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  private baseUrl = environment.apiUrl;
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  enEspera: any[] = [];
  newNotificationsCount = 0;
  dataCliente: any[] = [];
  cliente: string = '';
  nombre: string = '';
  celular: string = '';
  acceso_APEU: string = '';



  //  private isPageLoaded: boolean = false;
  searchText: string = '';
  darkModeEnabled = false;
  formattedTimeString: string | null | undefined;


  constructor(private activatedRoute: ActivatedRoute, private menuController: MenuController, private modalController: ModalController, private navCtrl: NavController, private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';

    console.log("recive userid ", this.userId, "<--");

  }

  ngOnInit() {
    this.http.get(`${this.baseUrl}/anuncios/obtenerAnuncioPorCorreo?correo=${this.userId}`)
      .subscribe(response => {
        this.acceso_APEU = JSON.stringify(response);
        const miObjetoParseado = JSON.parse(this.acceso_APEU);
        const miPropiedad = miObjetoParseado;
        localStorage.setItem('accesoPagoEntreUsuarios', miPropiedad.encontrado.toString());

        console.log(miPropiedad.encontrado);
        if (miPropiedad.encontrado || localStorage.getItem('accesoPagoEntreUsuarios') === 'true') {
          console.log("en true");

          this.getAds();
          this.contNotifications();
          //para obtener nombre del usuario
          this.getNombre();
          //tema oscuro por defecto
          //this.toggleDarkMode();
        } else {
          console.log("en false");

          this.router.navigateByUrl('/acceso');

        }
      })




  }
  ionViewWillEnter() {
    this.getAds();
    this.contNotifications();
  }
  getAds() {
    this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncios`).subscribe(
      data => {
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        this.enEspera = this.ads.filter(ad => ad.idAnuncioPrincipal && ad.postulante === this.userId);
        if (this.enEspera.length > 0) {
          this.ads = this.ads.filter(ad => (ad.postulante === '' && ad.estado === '0') || ad.postulante === this.userId);
          this.ads.forEach(res => {
            this.ads = this.ads.filter(ad => ad._id !== res.idAnuncioPrincipal);
          });
          console.log('feed arriba', this.ads);
        } else {
          this.ads = this.ads.filter(ad => ad.postulante === '' && ad.estado === '0');
          console.log('feed abajo', this.ads);
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
  goToMiPerfil() {
    this.navCtrl.navigateForward('/mi-perfil');
  }
  goToMisPublicaciones() {
    this.navCtrl.navigateForward('/mis-publicaciones');
  }
  goToMisTrabajos() {
    this.navCtrl.navigateForward('/mis-trabajos');
  }
  goToNotificaciones() {
    this.showNotifications();
  }
  goTotest() {
    this.navCtrl.navigateForward('/front-all');
  }
  login() {
    localStorage.removeItem('userId');

    this.router.navigateByUrl('/login');
  }
  editAd(ad: Anuncio) {
    console.log("listo", ad);
    const navigationExtras: NavigationExtras = {
      state: {
        ad: ad,
        anuncioId: ad._id
      }
    };
    this.router.navigate(['/edit-ad'], navigationExtras);
  }
  aplicar(ad: Anuncio) {
    console.log("listo para apply", this.nombre);
    const navigationExtras: NavigationExtras = {
      state: {
        ad: ad,
        anuncioId: ad._id,
        nombreTrabajador: this.nombre,
        numeroTrabajador: this.celular,
      }
    };
    this.router.navigate(['/apply'], navigationExtras);
  }
  eliminateAd(ad: Anuncio) {
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
        const totalNotifications = data.clientes.filter(ad => ad.para === this.userId);
        console.log('conteo ', totalNotifications);
        this.newNotificationsCount = totalNotifications.length;
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
      console.log("aqui btn ", menuItems);

      menuItems.forEach(menuItem => {
        menuItem.classList.toggle('menu-item-dark', this.darkModeEnabled);
      });
    }

  }

  getTiempoTranscurrido(fechaSeleccionada: any): string {
    const fecha = moment(fechaSeleccionada);
    const diferencia = moment().diff(fecha, 'minutes');

    if (diferencia < 60) {
      return `hace ${diferencia} minutos`;
    } else if (diferencia < 1440) {
      return `hace ${moment().diff(fecha, 'hours')} horas`;
    } else {
      return `hace ${moment().diff(fecha, 'days')} días`;
    }
  }

  getNombre() {
    this.http.get<Cliente>(`${this.baseUrl}/clientes/obtenerCliente/${this.userId}`).subscribe(
      data => {
        this.dataCliente = data.cliente
        this.cliente = JSON.stringify(this.dataCliente);
        const miObjetoParseado = JSON.parse(this.cliente);
        const miPropiedad = miObjetoParseado;
        this.nombre = miPropiedad.nombre
        this.celular = miPropiedad.celular
        localStorage.setItem('nombre', this.nombre);
        localStorage.setItem('celular', this.celular);

        console.log("nombre ", this.nombre, this.celular);
      }
    )
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MensajesPopPage,
      componentProps: {
        mensaje: 'false',
        codigopop: this.acceso_APEU
      },
      backdropDismiss: false
    });
    return await modal.present();
  }

  doRefresh() {
    this.getAds();
    this.contNotifications();
    this.getNombre();
  }

}
