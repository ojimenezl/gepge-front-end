import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Anuncio {
  _id: string;
  titulo: string;
  descripcion: string;
  precioAnunciante: number;
  precioTrabajador: number;
  lugarAnunciante: string;
  lugarTrabajador: string;
  transporte: string;
  tiempoAnunciante: string;
  tiempoTrabajador: string;
  tipoPago:string;
  creador: string;
  idAnuncioPrincipal:String;
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

@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
})
export class ApplyPage implements OnInit {
  private baseUrl = environment.apiUrl;

  ad: Anuncio;
  ads: any[] = [];

  AdForm: FormGroup;
  anuncioId: string = '';
  id_new_Anuncio: string ='';
  _idAnuncioHijo: string ='';
  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.AdForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioAnunciante: [0, Validators.required],
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
  }

  ngOnInit() {
    // this.http.get<ApiResponse>('http://localhost:3001/anuncios/obtenerAnuncios').subscribe(
    //   data => {
    //     this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
    //     this.ads  = this.ads.filter(ad => ad.postulante === '' && ad.estado === '0');
    //     console.log(this.ads);
        
       
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['ad']) {
        this.ad = this.router.getCurrentNavigation()?.extras?.state?.['ad'];
        this.anuncioId = this.router.getCurrentNavigation()?.extras?.state?.['anuncioId']; // obtener el ID del anuncio
        this.AdForm.patchValue({
          creador: this.ad.creador,
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

  addAd() {
    console.log('aqui');
    
    const data = this.AdForm.value;
    

    
    //mi anuncio al que postule
    data.estado = '0';
    data.postulante = localStorage.getItem('userId') || '';
    data.idAnuncioPrincipal = this.ad._id;
    
    this.http.post(`${this.baseUrl}/anuncios/crearAnuncio`, data).pipe(
      switchMap((response: any) => {
        let jsonData = response.cliente;
        this.id_new_Anuncio = jsonData._id;
        localStorage.setItem('idAnuncioHijo', this.id_new_Anuncio);
        console.log("aquiii new", this.id_new_Anuncio);
    
        data.correoTrabajador = localStorage.getItem('userId') || '';
        data.correoAnunciante = this.ad.creador;
        data.tipo = "Postulante";
        data.para = this.ad.creador;
        data._idAnuncio = this.ad._id;
        data._idAnuncioHijo = localStorage.getItem('idAnuncioHijo') || '';
        console.log('envio notificaion al anunciante ', localStorage.getItem('idAnuncioHijo') || '');
    
        return this.http.post(`${this.baseUrl}/notificaciones/crearNotificacion`, data);
      })
    ).subscribe(response => {
      console.log(response);
    });
    


    //data.estado='1'
    data.postulante=""
    //cambio estado al anuncio ya que hay un postulado
    this.http.put(`${this.baseUrl}/anuncios/actualizarAnuncio/${this.ad._id}`, data).subscribe(response => {
      
    console.log(this.id_new_Anuncio);
    });
    this.router.navigateByUrl('/feed');
    
  }
  

}
