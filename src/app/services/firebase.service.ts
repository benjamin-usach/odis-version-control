import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(
    private _afs: AngularFirestore,
    
    ) {}


  getCollectionfb(ruta: string): Observable<any> {
    let documentCollection = this._afs.collection(ruta);
    return documentCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      )
    )
  }

  /** 
   * function: postCollectionFB
   * @param ruta :    Ruta en la que se va a agregar un objeto
   * @param objeto:   Objeto a agregar 
   * 
   * returns: VOID
   * 
   */


  postCollectionFb( ruta: string, objeto: Object ): void {
    
    this._afs.collection(ruta).add(objeto)
      .then(
        resp => console.log("post answer:", resp.parent.id)
      )
      .catch(err=> console.log(err))
  }

  deleteCollectionFb( ruta: string, id: string ){
    this._afs.doc(`${ruta}/${id}`).delete()
      .then(ok => console.log(ok))
      .catch(err => console.log(err))
  }

  updateCollectionFB(ruta: string, id: string, objeto: Object){
    this._afs.doc(`${ruta}/${id}`).update(objeto)
    .then(resp => console.log(resp))
    .catch(err => console.log(err));

  }

}