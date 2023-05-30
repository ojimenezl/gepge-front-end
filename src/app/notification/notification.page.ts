import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
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
  nombreTrabajador:string,
  numeroTrabajador:string,
  tipo:string;
  para:string;
  estado: string;
  _idAnuncio:string;
  _idAnuncioHijo: string;
  EntregacodigoAnunciante:string;
  EntregacodigoTrabajador:string;
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
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  private baseUrl = environment.apiUrl;
  private keyFCM =environment.keyFCM;
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  adsString: string = '';

  private isPageLoaded: boolean = false;
  constructor(private modalController: ModalController,private navCtrl: NavController, private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';
    //console.log("userid ",this.userId);
    
  }

  ngOnInit() {
    this.getNotifications();
  }
  
  getNotifications() {
    this.http.get<ApiResponse>(`${this.baseUrl}/notificaciones/obtenerNotificacion`).subscribe(
      data => {
       // console.log(this.userId);
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        //this.ads  = this.ads.filter(ad => ad.correoAnunciante === this.userId || ad.correoTrabajador === this.userId || ad.para === this.userId);
        this.ads  = this.ads.filter(ad => ad.para === this.userId);
       // console.log('noti ',this.ads);
      },
      error => {
        console.log(error);
      }
    );
    
  }


  aceptar(ad: CreateNotificacion){
   // console.log('aqui 2',ad._idAnuncioHijo);
    
    //ad.tipo="AceptacionTrabajador"
    //ad.correoTrabajador = ad.correoTrabajador
    ad.para = ad.correoTrabajador 
    //console.log('data notofocatons',ad._idAnuncio,ad._id);
    ad.estado='1'
    ad.EntregacodigoAnunciante='enEspera'
    ad.EntregacodigoTrabajador='enEspera'
    const id= ad._id
    delete ad._id;
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${ad._idAnuncio}`, ad).subscribe(response => {
     // console.log(response);    
    });
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${ad._idAnuncioHijo}`, ad).subscribe(response => {
     // console.log(response);    
    });
    ad.tipo="Postulante"
    ad.para = this.userId
    this.http.put(`${this.baseUrl}/notificaciones/actualizarNotificacion/${id}`, ad).subscribe(response => {
     // console.log(response); 
        
    });
    delete ad._id;
    ad.tipo="AceptacionTrabajador"
    ad.correoTrabajador = ad.correoTrabajador
    ad.para = ad.correoTrabajador
    this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, ad).subscribe(response => {
     // console.log(response,'fin');
      this.router.navigateByUrl('/feed'); 
      
    });

    //notificacion para informar que se ha aceptado al postulante
    ///

    this.http.get<Cliente>(`${this.baseUrl}/clientes/obtenerTokenCliente/${ad.correoTrabajador}`).subscribe(
      gettoken => {
       // console.log(gettoken.cliente);
        
    const token = gettoken.cliente;
    const body = {
      to: token,
      notification: {
        title: 'Nuevo Postulante',
        body: 'Han aceptado tu postulado para el puesto que has aplicado, entra y revisalo!'
      }
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.keyFCM
    });
    this.http.post('https://fcm.googleapis.com/fcm/send', body, { headers }).subscribe(response => {
      console.log('La notificación push fue enviada correctamente');
    }, error => {
      console.error('Error al enviar la notificación push', error);
    });
    })
    ///
    ///

    this.http.get(`${this.baseUrl}/anuncios/obtenerAnunciosPorIdAnuncioPrincipal/${ad._idAnuncio}`).subscribe(
      response => {
        this.adsString = JSON.stringify(response);
        const miObjetoParseado = JSON.parse(this.adsString);
        //console.log("obj",miObjetoParseado);
        //console.log("length",miObjetoParseado.anuncios.length);
        // Acceder a la propiedad
        for (let i = 0; i < miObjetoParseado.anuncios.length; i++) {
          if (miObjetoParseado.anuncios[i].postulante !== ad.correoTrabajador) {
          ad.para = miObjetoParseado.anuncios[i].postulante;
          ad.tipo='noSeleccionado'
          this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, ad).subscribe(response => {
           // console.log(response,'fin');
            
          });
          }
        }
        this.router.navigateByUrl('/feed'); 
        
        //console.log("listooooo", objPostulantesRechazados);
        
      },
      error => {
        console.log(error);
      }
    );
    
    this.eliminarAnuncio(ad)

   
  
   
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
         // console.log(response);
          // Actualizar la lista de anuncios después de la eliminación
          this.getNotifications();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  rechazar(ad: Notificacion){
    if (confirm('¿Estás seguro de que quieres rechazar al postulante?')) {
      console.log("rechazado ");
      
      this.http.delete(`${this.baseUrl}/notificaciones/eliminarNotificacion/${ad._id}`).subscribe(
        response => {
          //console.log(response);
          const noti= {
            para: ad.correoTrabajador,
            tipo:'Rechazado'
          }
          
          this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, noti).subscribe(response => {
            //console.log(response,'fin');
            this.router.navigateByUrl('/feed'); 
            
          });
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

  eliminarAnuncio(ad:any) {
    const id = ad._idAnuncio;
    //console.log(ad._idAnuncio);
    
    const correoTrabajador = ad.correoTrabajador;
    this.http.delete(`${this.baseUrl}/anuncios/eliminarAnunciosHijos/${id}/${correoTrabajador}`).subscribe(
      response => {
      //  console.log(response);
        // Actualizar la lista de anuncios después de la eliminación
        //this.getAds();
      },
      error => {
        console.log(error);
      }
    );
  }
  
}
