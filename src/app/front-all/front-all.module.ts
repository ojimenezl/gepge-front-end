import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FrontAllPageRoutingModule } from './front-all-routing.module';
import { FrontAllPage } from './front-all.page'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FrontAllPageRoutingModule
  ],
  declarations: [FrontAllPage],
  exports: [FrontAllPage]
})
export class FrontAllPageModule {}
