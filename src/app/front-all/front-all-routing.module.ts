import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontAllPage } from './front-all.page';

const routes: Routes = [
  {
    path: '',
    component: FrontAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontAllPageRoutingModule {}

