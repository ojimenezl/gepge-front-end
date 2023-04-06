import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MensajesPopPage } from '../mensajes-pop/mensajes-pop.page';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.page.html',
  styleUrls: ['./acceso.page.scss'],
})
export class AccesoPage implements OnInit {
  private baseUrl = environment.apiUrl;
  acceso_APEU: string = '';


  constructor( private navCtrl: NavController,private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private router: Router,private modalController: ModalController,private http: HttpClient) {
  
  }

  ngOnInit() {
      this.acceso_APEU = localStorage.getItem('accesoPagoEntreUsuarios') || '';
  }
  goToMisPublicaciones() {
    this.navCtrl.navigateForward('/mis-publicaciones');
  }
  login(){
    this.router.navigateByUrl('/login');
  }
  

}
