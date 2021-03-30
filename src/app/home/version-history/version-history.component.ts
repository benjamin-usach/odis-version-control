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
    
    this.fbs.getCollectionfb("version").subscribe(resp => {
      this.versions = resp;
      for(var i = 0; i < this.versions.length; i++){
        this.versions[i].noHtml = this.versions[i].descripcion.replace(/<[^>]*>/g, ' ');
        let tempVer: version= this.versions[i];
        if(this.versions[i]['has_files']){
          this.fbs.getCollectionfb(`version/${this.versions[i].id}/files`).subscribe(resp =>{
            console.log("temp: ", tempVer);
            if(resp && resp.length > 0){
              console.log("files?: ", resp);
              tempVer.archivos = resp;
              this.versions[i] = tempVer;
              console.log(this.versions[i]);
            }
            else{console.log("no tiene archivos")}
          });
        }
      }
      this.versions.sort(function compare(a,b){return a.ver_release_date >= b.ver_release_date? -1 : 1;});
    })
    if(localStorage.getItem("admin")){
      this.admin = true;
    }
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
