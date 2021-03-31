import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { categorias, version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CarouselComponent } from '../carousel/carousel.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

  admin = false;
  cats: categorias[] = [];

  @Input() versions!: version[];

  constructor(private fbs: FirebaseService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    if(localStorage.getItem("admin")){
      this.admin=true;
    }
    console.log(this.versions);
    this.fbs.getCollectionfb("categoria").subscribe(v => this.cats = v);
    
  }

  borrar(id: string){
    this.fbs.deleteCollectionFb('version', id)
  }

  openDialog(data: object = {}): void {
    console.log(data);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      disableClose:true,
      data: [data, this.cats]
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


  editar(data: any){
    this.openDialog(data);
  }

  modalImagenes(imagenes: any[], id: string){
    console.log('image ID:',id)
    const dialogRef = this.dialog.open(CarouselComponent,{
      width: '80%',
      data: [imagenes, id]
    });

  }

}
