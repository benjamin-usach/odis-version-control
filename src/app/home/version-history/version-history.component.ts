import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { categorias, version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalComponent } from './shared/modal/modal.component';


@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {

  admin = false;

  versions: version[] = [];
  filtrado: version[] = [];
  filtro = false;
  cats: categorias[] = [];

  selected = "Todos";

  constructor( private fbs: FirebaseService,
               private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    const that = this;
    this.fbs.getCollectionfb("categoria").subscribe(res => that.cats = res);
    
    let ver = this.fbs.getCollectionfb("version").subscribe(resp => {
      this.versions = resp;
      this.versions.sort(function compare(a,b){return a.ver_release_date >= b.ver_release_date? -1 : 1;});
      for(let j = 0; j < this.versions.length; j++){
        this.versions[j].noHtml = this.versions[j].descripcion.replace(/<[^>]*>/g, ' ');
        let tempVer: version= this.versions[j];
        if(this.versions[j]['has_files']){
          this.fbs.getCollectionfb(`version/${this.versions[j].id}/files`).subscribe(res =>{
            //Aqui tiene un bug 
            if(res && res.length > 0){
              tempVer.archivos = res;
              this.versions[j] = tempVer;
            }
            else{console.log("no tiene archivos")}
          });
        }
      }
    })
    if(localStorage.getItem("admin")){
      this.admin = true;
    }
    console.log(this.versions);
  }

  show( p: any ){
    console.log(p);
  }

  openDialog(data: object = {}): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      disableClose:true,
      data: [data, this.cats]
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  filtrar(){
    this.filtrado = this.versions.filter( v => v.categoria === this.selected);
    this.filtro = true;
  }

  buscar(termino: string){
    if(termino === '') return;
    console.log("BUSCA")
    this.filtrado = this.versions.filter(v => v.tags?.includes(termino));
    this.filtro = true;
  }

  revisarCaja(value: string){
    if(value === '') this.filtro = false;
  }

}
