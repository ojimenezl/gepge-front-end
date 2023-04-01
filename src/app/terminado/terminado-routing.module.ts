import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminadoPage } from './terminado.page';

const routes: Routes = [
  {
    path: '',
    component: TerminadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminadoPageRoutingModule {}
