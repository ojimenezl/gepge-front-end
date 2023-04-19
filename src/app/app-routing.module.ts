import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignUpPage } from './sign-up/sign-up.page';
import { LoginPage } from './login/login.page';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
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
    loadChildren: () => import('./type-user/type-user.module').then( m => m.TypeUserPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-ad',
    loadChildren: () => import('./create-ad/create-ad.module').then( m => m.CreateAdPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-method',
    loadChildren: () => import('./payment-method/payment-method.module').then( m => m.PaymentMethodPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule),
    component: SignUpPage
  },
  {
    path: 'edit-ad',
    loadChildren: () => import('./edit-ad/edit-ad.module').then( m => m.EditAdPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'apply',
    loadChildren: () => import('./apply/apply.module').then( m => m.ApplyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-publicaciones',
    loadChildren: () => import('./mis-publicaciones/mis-publicaciones.module').then( m => m.MisPublicacionesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-trabajos',
    loadChildren: () => import('./mis-trabajos/mis-trabajos.module').then( m => m.MisTrabajosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'estado-anuncio',
    loadChildren: () => import('./estado-anuncio/estado-anuncio.module').then( m => m.EstadoAnuncioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'estado-anuncio-trabajador',
    loadChildren: () => import('./estado-anuncio-trabajador/estado-anuncio-trabajador.module').then( m => m.EstadoAnuncioTrabajadorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'terminado',
    loadChildren: () => import('./terminado/terminado.module').then( m => m.TerminadoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mensajes-pop',
    loadChildren: () => import('./mensajes-pop/mensajes-pop.module').then( m => m.MensajesPopPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recibir',
    loadChildren: () => import('./recibir/recibir.module').then( m => m.RecibirPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'front-all',
    loadChildren: () => import('./front-all/front-all.module').then( m => m.FrontAllPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'acceso',
    loadChildren: () => import('./acceso/acceso.module').then( m => m.AccesoPageModule),
    canActivate: [AuthGuard]
  },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
