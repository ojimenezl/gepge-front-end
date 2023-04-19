import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
if (environment.production) {
  enableProdMode();
}
// const firebaseConfig = {
//   apiKey: "AIzaSyBVWe1iiElX-P9sQxN9CiUxy_KYgn14C8U",
//   authDomain: "gepge-bed9c.firebaseapp.com",
//   projectId: "gepge-bed9c",
//   storageBucket: "gepge-bed9c.appspot.com",
//   messagingSenderId: "424728107976",
//   appId: "1:424728107976:web:1e8844029be0035a5f3efd",
//   measurementId: "G-CYT2VVVNED"
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
