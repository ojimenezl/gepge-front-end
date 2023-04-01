import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeUserPage } from './type-user.page';

const routes: Routes = [
  {
    path: '',
    component: TypeUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeUserPageRoutingModule {}
