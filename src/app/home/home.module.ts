import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './version-history/shared/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from './version-history/shared/accordion/accordion.component';
import { NgxEditorModule } from 'ngx-editor';
import { RxReactiveFormsModule  } from '@rxweb/reactive-form-validators';
import { NgSelectModule } from '@ng-select/ng-select';
import { VersionPipe } from './pipes/version.pipe';
import { CarouselComponent } from './version-history/shared/carousel/carousel.component';
import { MailerComponent } from './version-history/shared/mailer/mailer.component';
import { MailAdminComponent } from './version-history/shared/mail-admin/mail-admin.component';
import { DocIconsPipe } from './pipes/doc-icons.pipe';




@NgModule({
  declarations: [VersionHistoryComponent, ModalComponent, AccordionComponent, VersionPipe, CarouselComponent, MailerComponent, MailAdminComponent, DocIconsPipe],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgxEditorModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',

        // popups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    })

  ],
  exports: [
    NgbModule,
  ]
})
export class HomeModule { }
