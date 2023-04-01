import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeUserPageRoutingModule } from './type-user-routing.module';

import { TypeUserPage } from './type-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeUserPageRoutingModule
  ],
  declarations: [TypeUserPage]
})
export class TypeUserPageModule {}
