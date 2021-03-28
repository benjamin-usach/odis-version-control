import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

  @Input() versions!: version[];

  constructor(private fbs: FirebaseService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  borrar(id: string){
    this.fbs.deleteCollectionFb('version', id)
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


  editar(data: any){
    this.openDialog(data);
  }

}