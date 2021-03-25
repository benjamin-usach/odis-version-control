import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './version-history/shared/modal/modal.component';




@NgModule({
  declarations: [VersionHistoryComponent, ModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule
  ],
  exports: [
    NgbModule
  ]
})
export class HomeModule { }
