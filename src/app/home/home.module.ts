import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './version-history/shared/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from './version-history/shared/accordion/accordion.component';




@NgModule({
  declarations: [VersionHistoryComponent, ModalComponent, AccordionComponent],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgbModule
  ]
})
export class HomeModule { }
