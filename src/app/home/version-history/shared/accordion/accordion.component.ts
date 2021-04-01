import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { categorias, version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';
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

  borrar(id: string, index: number){
    Swal.fire({
      title: `Confirmar borrado de elementos ${this.versions[index].ver_number}`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      showConfirmButton: true,

    })
    const aux = this.versions[index];
    if(aux.has_doc){
      for(let i = 0; i < aux.archivos.length; i++){
        const arch_aux = aux.archivos[i]
        this.fbs.deleteFile(arch_aux.id, 'version', arch_aux.nombre, 'docs')
      }
    }  
    if(aux.has_image){
      for(let i = 0; i < aux.imagenes.length; i++){
        const arch_aux = aux.imagenes[i]
        this.fbs.deleteFile(arch_aux.id, 'version', arch_aux.nombre, 'image')
      }
    }  
    this.fbs.deleteCollectionFb('version', id);
    
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

  modalImagenes(imagenes: any[], id: string, version_id: string){
    console.log('image ID:',id)
    this.dialog.open(CarouselComponent,{
      width: '100%',
      height: '60vw',
      data: [imagenes, id, version_id],
    });

  }

}
