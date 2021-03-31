import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MailList } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mailer',
  templateUrl: './mailer.component.html',
  styleUrls: ['./mailer.component.css']
})
export class MailerComponent implements OnInit {

  lists: MailList[] = []
  to: string[] = [];
  preview: Array<any> = [];


  constructor( 
    private fb: FirebaseService, 
    private dialogRef: MatDialogRef<MailerComponent>
    ) {   }

  ngOnInit(): void {
    this.fb.getCollectionfb('mail_list').subscribe(resp => this.lists = resp);
  }

  mail(){
    Swal.fire("Correo enviado!", "", "success").then(a => this.dialogRef.close());
  }

  actualizarLista(){
    this.to = this.preview.reduce((acc, val) => acc.concat(val), []);
    console.log(this.lists);
  }

  cerrar(){
    this.dialogRef.close();
  }

}
