import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ApiResponse {
  mensaje: string;
  clientes: {
    nombre:string;
    email:string;
    cedula:string;
    celular:string;
    ciudad:string;
    fechaNacimiento:string;
    //apellido: String,
    //edad: Number,
    password:string;
    fechaCreacion:string;
    __v: number;
  }[];
}
@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})


export class MiPerfilPage implements OnInit {
  private baseUrl = environment.apiUrl;
  MiPerfilForm: FormGroup;
  dias:any[] = [];
  meses:any[] = [];
  year:any[] = [];
  userId: string;
  ads: any[] = [];
  ad: any[] = [];
  enEspera:  any[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    this.userId = localStorage.getItem('userId') || '';
    this.MiPerfilForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      cedula:['', Validators.required],
      celular:['', Validators.required],
      ciudad:['', Validators.required],
      year:['', Validators.required],
      mes:['', Validators.required],
      dia:['', Validators.required],
      //confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAds()
    this.dias = Array.from({length: 31}, (_, i) => i+1);
    this.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.year = Array.from({length: 120}, (_, i) => (new Date().getFullYear() - i));

  }
  getAds() {
    this.http.get<ApiResponse>(`${this.baseUrl}/clientes/obtenerClientes`).subscribe(
      data => {
        this.ads = data.clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        this.ads  = this.ads.filter(ad => ad.email === this.userId);
       // Supongamos que queremos asignar los datos del primer cliente al formulario
       const fechaNacimiento = this.ads[0].fechaNacimiento;
       const partesFecha = fechaNacimiento.split("-"); 
       console.log(partesFecha[0]);
       console.log(partesFecha[1]);
       console.log(partesFecha[2]);
       
       this.MiPerfilForm.patchValue({
          id: this.ads[0]._id,
          nombre: this.ads[0].nombre,
          email: this.ads[0].email,
          cedula: this.ads[0].cedula,
          celular: this.ads[0].celular,
          ciudad: this.ads[0].ciudad,
          dia: parseInt(partesFecha[0]),
          mes: partesFecha[1],
          year: parseInt(partesFecha[2]),
          password:this.ads[0].password
        });

        console.log('clinetes',this.ads[0].fechaNacimiento);      
      },
      error => {
        console.log(error);
      }
    );
    
  }
  updateUser() {
    const data = this.MiPerfilForm.value;
    data.fechaNacimiento=data.dia+'-'+data.mes+'-'+data.year;
    this.http.put(`${this.baseUrl}/clientes/actualizarCliente/${data.id}`, data).subscribe(response => {
      console.log(response);
    });
    this.router.navigate(['/feed']);
  }
  goToHome() {
    this.router.navigateByUrl('/feed');
  }
}

