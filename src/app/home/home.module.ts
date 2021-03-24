import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [VersionHistoryComponent],
  imports: [
    CommonModule,
    NgbModule,
//    MaterialModule
  ],
  exports: [
    NgbModule
  ]
})
export class HomeModule { }
