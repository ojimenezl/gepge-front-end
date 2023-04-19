import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLoggedIn(): boolean {
    // Comprueba si el usuario ha iniciado sesión almacenando su correo electrónico en localStorage
    const userId = localStorage.getItem('userId');
    return !!userId;
  }
}
