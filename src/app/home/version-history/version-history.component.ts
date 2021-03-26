import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalComponent } from './shared/modal/modal.component';


@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {


  versions: version[] = [];

  selected = -1;

  constructor( private fbs: FirebaseService,
               private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.fbs.getCollectionfb("version").subscribe(resp => {
      console.log(resp);
      this.versions = resp;
      this.versions.sort()
    })
  }

  show( p: any ){
    console.log(p);
  }

  openDialog(data: object = {}): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      disableClose:true,
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  expand(){}

  borrar(id: string){
    this.fbs.deleteCollectionFb('version', id)
  }

  editar(data: any){
    this.openDialog(data);
  }

}
