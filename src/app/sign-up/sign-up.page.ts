import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  private baseUrl = environment.apiUrl;
  signUpForm: FormGroup;
  dias:any[] = [];
  meses:any[] = [];
  year:any[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router,private http: HttpClient) {
    
    this.signUpForm = this.formBuilder.group({
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
    this.dias = Array.from({length: 31}, (_, i) => i+1);
    this.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.year = Array.from({length: 120}, (_, i) => (new Date().getFullYear() - i));

  }

  registerUser() {
    const data = this.signUpForm.value;
    data.fechaNacimiento=data.dia+'-'+data.mes+'-'+data.year;
    console.log(data.fechaNacimiento);

    this.http.post(`${this.baseUrl}/clientes/crearCliente`, data).subscribe(response => {
      console.log(response);
    });
    this.router.navigate(['/login']);
  }
}
