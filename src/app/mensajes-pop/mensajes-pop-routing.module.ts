import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajesPopPage } from './mensajes-pop.page';

const routes: Routes = [
  {
    path: '',
    component: MensajesPopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajesPopPageRoutingModule {}
