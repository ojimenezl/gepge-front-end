import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItemReorderEventDetail } from '@ionic/angular';
import { ModalController} from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { environment } from '../../environments/environment';


interface Anuncio {
  _id: string;
  titulo: string;
  descripcion: string;
  precioAnunciante: number;
  precioTrabajador: number;
  lugarAnunciante: string;
  correoAnunciante:string;
  lugarTrabajador: string;
  transporte: string;
  tiempoAnunciante: string;
  tiempoTrabajador: string;
  tipoPago:string;
  creador: string;
  estado:string;
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
    correoAnunciante:string;
    transporte: string;
    tiempoAnunciante: string;
    tipoPago: string;
    estado:string;
    fechaCreacion: string;
    __v: number;
  }[];
}


@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
})
export class MisPublicacionesPage implements OnInit {
  private baseUrl = environment.apiUrl;
  userId: string;
  id: string = '';
  ad: Anuncio;
  AdForm: FormGroup;
  anuncioId: string = '';
  ads: any[] = [];
  items : any[] = [];
  envio: any[] = [];

  currentAd: Anuncio | undefined;
  isModalOpen = false;
  adsString: string = '';


  constructor(private modalController: ModalController,private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
      correoAnunciante: [''],
      precioTrabajador: [0, Validators.required],
      lugarAnunciante: ['', Validators.required],
      lugarTrabajador: ['', Validators.required],
      precioTransporte: [''],
      tiempoAnunciante: ['', Validators.required],
      tiempoTrabajador: ['', Validators.required],
      tipoPago: ['', Validators.required],
      creador: [''],
    });
    this.ad = {} as Anuncio;
    this.userId = localStorage.getItem('userId') || '';
    console.log("recive userid ",this.userId,"<--");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['ad']) {
        this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']; // obtener el ID del anuncio
        this.AdForm.patchValue({
          titulo: this.ad.titulo,
          descripcion: this.ad.descripcion,
          precioAnunciante: this.ad.precioAnunciante,
          lugarAnunciante: this.ad.lugarAnunciante,
          transporte: this.ad.transporte,
          tiempoAnunciante: this.ad.tiempoAnunciante,
          tipoPago: this.ad.tipoPago,
        });
      }
    });
  }
  ngOnDestroy() {
    this.modalController.dismiss();
  }
  ionViewWillEnter(){
    this.getAds();
  }
  getAds() {
    const storedObject = localStorage.getItem('miListaPublicaciones');
    // if(storedObject){
    // const parsedObject = JSON.parse(storedObject);  
    // this.ads = parsedObject;
    // }else{
    this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncios`).subscribe(
      data => {
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        this.ads  = this.ads.filter(ad => ad.creador === this.userId && ad.postulante === "");
      },
      error => {
        console.log(error);
      }
    );
    //}
    
  }
  addAd() {
    const data = this.AdForm.value;
    console.log(data);
    data.correoTrabajador = localStorage.getItem('userId') || '';
    this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, data).subscribe(response => {
      console.log(response);
    });
    data.postulante = localStorage.getItem('userId') || '';
    this.http.post(`${this.baseUrl}/anuncios/crearAnuncio`, data).subscribe(response => {
      console.log(response);
    });
    this.router.navigateByUrl('/feed');
    
  }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log('Before complete', this.ads);
    this.ads = ev.detail.complete(this.ads);
    console.log('After complete', this.ads);
    localStorage.setItem('miListaPublicaciones', JSON.stringify(this.ads));
  }
  eliminateAd(id: any){
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?'+id)) {
        this.http.delete(`${this.baseUrl}/anuncios/eliminarAnuncios/${id}`).subscribe(
        response => {
          this.adsString = JSON.stringify(response);
          const miObjetoParseado = JSON.parse(this.adsString);
          console.log("obj",miObjetoParseado);
          console.log("length",miObjetoParseado.anuncios.length);
          // Acceder a la propiedad
          for (let i = 0; i < miObjetoParseado.anuncios.length; i++) {
            if (miObjetoParseado.anuncios[i].postulante !== this.userId) {
            miObjetoParseado.anuncios[i].para = miObjetoParseado.anuncios[i].postulante;
            delete miObjetoParseado.anuncios[i].fechaCreacion;

            miObjetoParseado.anuncios[i].tipo='AnuncioEliminado'
            this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, miObjetoParseado.anuncios[i]).subscribe(response => {
              console.log(response,'notificacion eliminsado');
              
            });
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  

  setOpen(isOpen: boolean,ad: Anuncio) {
    console.log("ver1 ",ad);
    
    if(isOpen){
      this.currentAd = ad;    
    }    
    this.isModalOpen = isOpen; 
  }
  
  goToEstado(ad: Anuncio){
    console.log("listo",ad);       
        const navigationExtras: NavigationExtras = {
          state: {
            ad: ad,
            anuncioId: ad._id 
          }
        };
        this.isModalOpen = false;
    this.router.navigateByUrl('/estado-anuncio', navigationExtras);
  }

  eliminarAnuncio(ad:any) {
    
  }
  goToHome() {
    this.router.navigateByUrl('/feed');


  }
}
