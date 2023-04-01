import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoAnuncioPage } from './estado-anuncio.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoAnuncioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoAnuncioPageRoutingModule {}
