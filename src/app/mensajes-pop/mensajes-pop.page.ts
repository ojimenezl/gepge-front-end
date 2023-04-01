import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreateAdPage } from '../create-ad/create-ad.page';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { environment } from '../../environments/environment';

interface ApiResponse {
  mensaje: string;
  clientes: {
    _id: string;
    descripcion: string;
    precio: number;
    lugar: string;
    fechaCreacion: string;
    correoAnunciante: string;
    correoTrabajador: string;
    tipo: string;
    __v: number;
  }[];
}
interface Notificacion {
  _id: string;
  descripcion: string;
  precio: number;
  lugar: string;
  creador: string;
  correoTrabajador: string;
}
interface CreateNotificacion {
  _id?: string;
  descripcion: string;
  precio: number;
  lugar: string;
  creador: string;
  correoTrabajador: string;
  tipo: string;
  para: string;
  estado: string;
  _idAnuncio: string;
  _idAnuncioHijo: string;
}

@Component({
  selector: 'app-mensajes-pop',
  templateUrl: './mensajes-pop.page.html',
  styleUrls: ['./mensajes-pop.page.scss'],
})
export class MensajesPopPage implements OnInit {
  private baseUrl = environment.apiUrl;
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  mensaje: string = '';
  anuncioId: string = '';
  Terminado: boolean = false;
  Recibido: boolean = false;
  codigoObj: any[] = [];
  codigo: any[] = [];
  codigopop: string = '';
  adssms: string = '';
  validarCodigo: string = '';
  ingresoCodigo: string = '';
  codigoCorrecto: boolean = false;
  private isPageLoaded: boolean = false;
  AdForm: FormGroup;
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  constructor(private formBuilder: FormBuilder, private modalController: ModalController, private navCtrl: NavController, private navParams: NavParams, private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';
    console.log("userid ", this.userId);
    this.AdForm = this.formBuilder.group({

      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],

    });

  }

  ngOnInit() {
    if (this.mensaje == 'Terminado') {
      this.Terminado = true;
    }
    if (this.mensaje == 'Recibido') {
      this.Recibido = true;
    }
  }
  addAd() {
    // const data = this.AdForm.value;
    // console.log(data);
    // data.creador = localStorage.getItem('userId') || '';
    // data.postulante = '';
    // data.estado='0'
    // this.http.post('http://localhost:3001/anuncios/crearAnuncio', data).subscribe(response => {
    //   console.log(response);
    // });
    //this.router.navigateByUrl('/feed');

  }
  validar() {
    console.log("aqui");

    const data = this.AdForm.value;
    this.ingresoCodigo = data.digit1.toString() + data.digit2.toString() + data.digit3.toString() + data.digit4.toString() + data.digit5.toString();


    this.http.get<ApiResponse>(`${this.baseUrl}/anuncios/obtenerAnuncio/${this.anuncioId}`).subscribe(
      data => {

        this.codigoObj = data.clientes
        this.adssms = JSON.stringify(this.codigoObj);
        const miObjetoParseado = JSON.parse(this.adssms);
        const miPropiedad = miObjetoParseado;
        if (miPropiedad.hasOwnProperty('codigoAnunciante')) {
          this.codigo = miPropiedad.codigoAnunciante
          console.log(this.ingresoCodigo, " == ", this.codigo.toString());

          if (this.ingresoCodigo == this.codigo.toString()) {
            this.codigoCorrecto = true
          }else{
            this.codigoCorrecto=false

          }

        }
      });
  }
  async dismiss() {
    await this.modalController.dismiss();
  }
  scrollToBottom() {
    this.content.scrollToBottom(500);
  }
}
