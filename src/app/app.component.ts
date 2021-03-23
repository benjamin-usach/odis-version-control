import { Component, OnInit } from '@angular/core';


import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'versionHistory';

  public documentos$! : Observable<any[]>;
  private documentosCollection!: AngularFirestoreCollection<any>;


  


  constructor(
    private _afs: AngularFirestore,
    //private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit(){
    console.log("Hola mundo");

    this.documentosCollection = this._afs.collection(
      "version"
    );

    this.documentos$ = this.documentosCollection.snapshotChanges().pipe(
      map( actions =>
        actions.map( a => {
          //console.log(a);
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log({ id, ...data });
          return { id, ...data };
        })
      )
    );
    
    

    this.documentos$.subscribe(resp => console.log(resp));

  }

  agregar(){
    this._afs.collection("version").add(
      {
      categoria: "jICcX0aawQh2Cm4eMsNS",
      descripcion: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure voluptas eligendi magni, fugit quidem quaerat. Labore ratione, obcaecati",
      id: "WmtcOn5rINS3CKfOZUBg",
      ver_creado_por: "benjamin.bravo",
      ver_editado_por: "benjamin.bravo",
      ver_number: "1.0.0"
      }
    );
  }

}
