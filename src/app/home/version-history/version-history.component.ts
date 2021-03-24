import { Component, OnInit } from '@angular/core';
import { version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {


  versions: version[] = [];

  selected = -1;

  constructor( private fbs: FirebaseService,

    ) { }

  ngOnInit(): void {
    this.fbs.getCollectionfb("version").subscribe(resp => {
      console.log(resp);
      this.versions = resp;
      console.log("versions: ", this.versions);
    })
  }

  show( p: any ){
    console.log(p);
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(AgregarComponent, {
  //     width: '500px',
  //     disableClose:true

  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');

  //   });
  // }

  expand(){}

}
