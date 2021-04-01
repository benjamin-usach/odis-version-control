import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage'
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import firebase from 'firebase/app'
import { FileItem } from '../models/models';
import { Item } from '../interfaces/version.interface';
 
@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(
    private _afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}


  getCollectionfb(ruta: string): Observable<any> {
    let documentCollection = this._afs.collection(ruta);
    return documentCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
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


  postCollectionFb( ruta: string, objeto: Object ): Promise<any> {
    
      return this._afs.collection(ruta).add(objeto);
      
  }

  /**
   * @param ruta: ruta de la colección donde borrar el documento 
   * @param id  : id del documento a borrar
   * 
   * returns: none
   */

  deleteCollectionFb( ruta: string, id: string ){
    this._afs.doc(`${ruta}/${id}`).delete()
      .then(ok => console.log(ok))
      .catch(err => console.log(err))
  }

  /**
   * @param ruta    : ruta del documento a actualizar
   * @param id      : id del documento a actualizar
   * @param objeto  : objeto actualizado [puede ser el objeto entero o solo los campos deseados]
   * 
   * 
   * 
   */

  updateCollectionFB(ruta: string, id: string, objeto: Object){
    this._afs.doc(`${ruta}/${id}`).update(objeto)
    .then(resp => console.log(resp))
    .catch(err => console.log(err));

  }

  saveFileFB(path: string, data: any, metadata?: UploadMetadata ){
    this.storage.upload(path, data, metadata).then(resp => console.log(resp))
  }

  cargarImagenesFirebase(
    imagenes: FileItem[],
    carpeta_archivo: string,
    created: any,
    extra?: any
  ) {
    const storageRef = firebase.storage().ref();
    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }

      // console.log(item);
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${carpeta_archivo}/${item.nombreArchivo}`)
        .put(item.archivo);

      uploadTask.on(
        "state_changed",
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          const count = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (count < 99) {
            item.progreso = Math.round(count);
          }

          if (count > 99 && count < 100) {
            item.progreso = 99;
          }

          if (count === 100) {
            item.progreso = 100;
          }

          // console.log('PROGESOO:   ' + item.progreso );
        },
        (_error) => {
          console.error("Error al subir");
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log('File available at', downloadURL);
            item.url = downloadURL;
            item.estaSubiendo = false;
            item.created = created;
            // eslint-disable-next-line max-len

            if (extra) {
              // eslint-disable-next-line max-len
              this.guardarImagenExtra(
                {
                  nombre: item.nombreArchivo,
                  type: item.type,
                  url: item.url!,
                  created: item.created,
                  id_case: extra,
                },
                carpeta_archivo
              );
            } else {
              this.guardarImagen(
                {
                  nombre: item.nombreArchivo,
                  type: item.type,
                  url: item.url!,
                  created: item.created,
                },
                carpeta_archivo
              );
            }
          });
        }
      );
    }
  }

  private guardarImagenExtra(
    imagen: {
      nombre: string;
      type: string;
      url: string;
      created: any;
      id_case: any;
    },
    path: string
  ) {
    this._afs.collection(`${path}`).add(imagen);
  }

  private guardarImagen(
    imagen: { nombre: string; type: string; url: string; created: any },
    path: string
  ) {
    // this.itemDoc = this.db.doc(`${ path }/${ item.id }`);

    /*
    this.afs.collection(`${ path }/`).get().subscribe((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
    });*/

    // console.log(path);
    this._afs
      .collection<Item>(path, (ref) =>
        ref.where("nombre", "==", imagen.nombre).limit(1)
      )
      .get()
      .subscribe((data) => {
        if (data.size > 0) {
          // console.log(data);
          data.forEach((doc) => {
            // console.log(doc.id);
            this._afs.collection(`${path}`).doc(doc.id).set(imagen);
          });
        } else {
          this._afs.collection(`${path}`).add(imagen);
        }
      });
  }

  /**
   * 
   * @param id: id archivo 
   * @param table: nombre de la tabla
   * @param nom: nombre del archivo
   * @param ruta: ruta firebase (docs || images)
   */


  deleteFile(id: string, table: string, nom:string, ruta:string) {

    const that=this;
    
    this._afs.collection(table).get().subscribe(caseFiles => {
      if (caseFiles.size > 0) {
        // console.log(caseFiles);
        
        caseFiles.forEach(doc => {
          const cfiles: any = doc.data();
          cfiles.id = doc.id;
          const storageRef = firebase.storage().ref();
          storageRef
            .child(`${table}/${cfiles.id}/${ruta}/${nom}`).delete()
            .then(function () {
              that._afs.doc(`${table}/${cfiles.id}/${ruta}/${id}`).delete();
            })
            .catch(function (error) {
              console.error('Uh-oh, an error occurred!: files order', error);
            });
        });
      }
    });
  }


}