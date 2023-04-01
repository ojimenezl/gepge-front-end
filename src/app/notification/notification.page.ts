import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreateAdPage } from '../create-ad/create-ad.page';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';


interface ApiResponse {
  mensaje: string;
  clientes: {
    _id: string;
    descripcion: string;
    precio: number;
    lugar: string;
    fechaCreacion: string;
    correoAnunciante:string;
    correoTrabajador:string;
    tipo:string;
    __v: number;
  }[];
}
interface Notificacion {
  _id: string;
  descripcion: string;
  precio: number;
  lugar: string;
  creador: string;
  correoTrabajador:string;
}
interface CreateNotificacion {
  _id?: string;
  descripcion: string;
  precio: number;
  lugar: string;
  creador: string;
  correoTrabajador:string;
  tipo:string;
  para:string;
  estado: string;
  _idAnuncio:string;
  _idAnuncioHijo: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  private baseUrl = environment.apiUrl;
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  private isPageLoaded: boolean = false;
  constructor(private modalController: ModalController,private navCtrl: NavController, private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';
    console.log("userid ",this.userId);
    
  }

  ngOnInit() {
    this.getNotifications();
  }
  
  getNotifications() {
    this.http.get<ApiResponse>(`${this.baseUrl}/notificaciones/obtenerNotificacion`).subscribe(
      data => {
        console.log(this.userId);
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        this.ads  = this.ads.filter(ad => ad.correoAnunciante === this.userId || ad.correoTrabajador === this.userId);
        console.log('noti ',this.ads);
      },
      error => {
        console.log(error);
      }
    );
    
  }


  aceptar(ad: CreateNotificacion){
    console.log('aqui 2',ad._idAnuncioHijo);
    
    //ad.tipo="AceptacionTrabajador"
    //ad.correoTrabajador = ad.correoTrabajador
    ad.para = ad.correoTrabajador
    
    console.log('data notofocatons',ad._idAnuncio,ad._id);
    ad.estado='1'
    const id= ad._id
    delete ad._id;
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${ad._idAnuncio}`, ad).subscribe(response => {
      console.log(response);    
    });
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${ad._idAnuncioHijo}`, ad).subscribe(response => {
      console.log(response);    
    });
    ad.tipo="Postulante"
    ad.para = this.userId
    this.http.put(`${this.baseUrl}/notificaciones/actualizarNotificacion/${id}`, ad).subscribe(response => {
      console.log(response); 
        
    });
    delete ad._id;
    ad.tipo="AceptacionTrabajador"
    ad.correoTrabajador = ad.correoTrabajador
    ad.para = ad.correoTrabajador
    this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, ad).subscribe(response => {
      console.log(response,'fin');
      this.router.navigateByUrl('/feed'); 
      
    });

   
  
   
    //aqui un if si es trajeta o efectivo
    // console.log("listo aceptar",ad);       
    //  const navigationExtras: NavigationExtras = {
    //    state: {
    //      ad: ad,
    //      anuncioId: ad._id 
    //    }
    //  };
    //this.router.navigate(['/credit-card'], navigationExtras);
    
    //this.navCtrl.navigateForward('/payment-method');
  }
  eliminateAd(ad: Notificacion){
    if (confirm('¿Estás seguro de que quieres eliminar la notificacion?')) {
      this.http.delete(`${this.baseUrl}/notificaciones/eliminarNotificacion/${ad._id}`).subscribe(
        response => {
          console.log(response);
          // Actualizar la lista de anuncios después de la eliminación
          this.getNotifications();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  goToMisTrabajos(){
    this.navCtrl.navigateForward('/mis-trabajos');
  }
  goToMisPublicaciones(){
    this.navCtrl.navigateForward('/mis-publicaciones');
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
