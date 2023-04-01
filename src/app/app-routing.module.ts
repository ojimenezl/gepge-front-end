import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignUpPage } from './sign-up/sign-up.page';
import { LoginPage } from './login/login.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    component: LoginPage
  },
  {
    path: 'type-user',
    loadChildren: () => import('./type-user/type-user.module').then( m => m.TypeUserPageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'create-ad',
    loadChildren: () => import('./create-ad/create-ad.module').then( m => m.CreateAdPageModule)
  },
  {
    path: 'payment-method',
    loadChildren: () => import('./payment-method/payment-method.module').then( m => m.PaymentMethodPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule),
    component: SignUpPage
  },
  {
    path: 'edit-ad',
    loadChildren: () => import('./edit-ad/edit-ad.module').then( m => m.EditAdPageModule)
  },
  {
    path: 'apply',
    loadChildren: () => import('./apply/apply.module').then( m => m.ApplyPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'mis-publicaciones',
    loadChildren: () => import('./mis-publicaciones/mis-publicaciones.module').then( m => m.MisPublicacionesPageModule)
  },
  {
    path: 'mis-trabajos',
    loadChildren: () => import('./mis-trabajos/mis-trabajos.module').then( m => m.MisTrabajosPageModule)
  },
  {
    path: 'estado-anuncio',
    loadChildren: () => import('./estado-anuncio/estado-anuncio.module').then( m => m.EstadoAnuncioPageModule)
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
  },
  {
    path: 'estado-anuncio-trabajador',
    loadChildren: () => import('./estado-anuncio-trabajador/estado-anuncio-trabajador.module').then( m => m.EstadoAnuncioTrabajadorPageModule)
  },
  {
    path: 'terminado',
    loadChildren: () => import('./terminado/terminado.module').then( m => m.TerminadoPageModule)
  },
  {
    path: 'mensajes-pop',
    loadChildren: () => import('./mensajes-pop/mensajes-pop.module').then( m => m.MensajesPopPageModule)
  },
  {
    path: 'recibir',
    loadChildren: () => import('./recibir/recibir.module').then( m => m.RecibirPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
