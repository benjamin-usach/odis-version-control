import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { NgbAccordion, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [VersionHistoryComponent],
  imports: [
    CommonModule,
    NgbModule,
  ],
  exports: [
    NgbModule
  ]
})
export class HomeModule { }
