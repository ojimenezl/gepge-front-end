import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoAnuncioTrabajadorPage } from './estado-anuncio-trabajador.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoAnuncioTrabajadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoAnuncioTrabajadorPageRoutingModule {}
