import { Component } from '@angular/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ngOnInit() {
    console.log('Initializing HomePage22222');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
       console.log('aquiii requestPermissions');

        PushNotifications.register();
      } else {
        console.log('noooooo aquiii requestPermissions');
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('aquiii token',token.value);

      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );
  }

}
