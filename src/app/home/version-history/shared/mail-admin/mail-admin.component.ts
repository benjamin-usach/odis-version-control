import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MailList } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-mail-admin',
  templateUrl: './mail-admin.component.html',
  styleUrls: ['./mail-admin.component.css']
})
export class MailAdminComponent implements OnInit {

  mailLists: MailList[] = [];
  newListName: string = '';
  newListList: string[] = [];
  items: string[] = [];
  correoInvalido = false;
  isExpanded = false;
  creado= false;

  constructor(
    private MatDialogRef: MatDialogRef<MailAdminComponent>,
    private fb: FirebaseService
  ) { }

  ngOnInit(): void {
    this.fb.getCollectionfb("mail_list").subscribe(resp => this.mailLists = resp);
  }

  cerrar(){
    this.MatDialogRef.close();
  }

  addMailList(mail: string){
    console.log(this.newListName, this.newListList);
    if(this.newListName.length > 3 && this.validateEmail(mail)){
      this.newListList.push(mail);
      this.correoInvalido = false;
    }
    else{
      this.correoInvalido = true;
      this.correoTrue();
    }
  }

  correoTrue(){
    setTimeout( () => { this.dismissAlert() }, 5000 )
  }

  dismissAlert(){
    this.correoInvalido = false;
  }

  validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  quitarCorreo(i: number){
    this.newListList.splice(i,1);
  }

  crearLista(){
    const that = this;
    this.fb.postCollectionFb("mail_list", {nombre: this.newListName, list: this.newListList})
    this.newListName = '';
    this.newListList = [];
    this.isExpanded = false;
    this.creado = true;
    setTimeout( () => { this.creado = false }, 5000 );
  }

}
