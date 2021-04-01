import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { categorias, version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';
import { Editor, Toolbar } from 'ngx-editor';
import { schema } from 'ngx-editor/schema';
import { toHTML, toDoc } from 'ngx-editor';
import { FileItem } from 'src/app/models/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MatTooltip } from '@angular/material/tooltip';
import { MailerComponent } from '../mailer/mailer.component';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  html = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['bullet_list'],
    ['link'],
  ];
  editar = false;
  imagenes: FileItem[] = [];
  archivos: FileItem[] = [];

  tags: string[] = [];


  constructor(  private dialogRef: MatDialogRef<ModalComponent>,
                private dialog: MatDialog,
                private fb: FirebaseService,
                @Inject(MAT_DIALOG_DATA) public data: any[]
    ) { }

  cats: categorias[] = this.data[1];

  versionForm!: FormGroup;
  //ver_id_validator: RegExp = new RegExp('[0-9]{1,3}\.[0-9]{1,3}\.[0-9]');

  //TODO: VALIDACIONES!!



  private initForm(){
    this.versionForm = new FormGroup({
      'categoria':        new FormControl( null,    Validators.required),
      'descripcion':      new FormControl( null,    Validators.required),
      'ver_creado_por':   new FormControl( null,    Validators.required),
      'ver_release_date': new FormControl( null,    Validators.required),
      'ver_number':       new FormControl( "0.0.0", Validators.required),
      'tags':             new FormControl( null,    Validators.required),
      'imagenes':            new FormControl( [],      [RxwebValidators.file({maxFiles: 8})]),
      'archivos':            new FormControl( [],      [RxwebValidators.file({maxFiles: 8})]),
      'beta':             new FormControl( false,   [] )
    });

  }


  ngOnInit(): void {

    this.initForm();
    this.editor = new Editor({
      content: '',
      plugins: [],
      schema,
      nodeViews: {},
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
    });

    if(this.data[0].id){
      this.editar = true;
      const that = this;
      this.tags = this.data[0].tags? this.data[0].tags : [];
      if(this.data[0].has_image) this.imagenes = this.data[0].imagenes.map(function(x: any){ console.log(x);return that.fbToFile(x)});
      if(this.data[0].has_doc) this.archivos = this.data[0].archivos.map(function(x: any){ console.log(x); return that.fbToFile(x)});
      console.log(this.archivos, this.imagenes);
      const date =  new Date(this.data[0].ver_release_date*1000 ).toISOString().slice(0,10);
      console.log(date);
      this.versionForm.setValue({
        'categoria':          this.data[0].categoria,
        'descripcion':        toDoc(this.data[0].descripcion),
        'ver_creado_por':     this.data[0].ver_creado_por,
        'ver_release_date':   date,
        'ver_number':         this.data[0].ver_number,
        'tags':               '',
        'imagenes':           this.data[0].imagenes,
        'archivos':           this.data[0].archivos,
        'beta':               this.data[0].beta? this.data[0].beta : false
      });
    } 

    console.log(this.editar)
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


  fbToFile(file: any): any{
    return {
      archivo: file,
      estaSubiendo: false,
      nombreArchivo: file.nombre,
      progreso: 0,
      type: file.type
    }

  }

   onImageSelected(event: any){
    console.log(event.target.files);
    console.log(this.imagenes)
    for(const propiedad in Object.getOwnPropertyNames(event.target.files)){
      const temp = event.target.files[propiedad];
      const nuevoArchivo = new FileItem(temp);
      this.imagenes.push(nuevoArchivo);      
    }
    console.log(this.imagenes);

  }

  onFileSelected(event: any){
    console.log(event.target.files);
    console.log(this.imagenes)
    for(const propiedad in Object.getOwnPropertyNames(event.target.files)){
      const temp = event.target.files[propiedad];
      const nuevoArchivo = new FileItem(temp);
      this.archivos.push(nuevoArchivo);      
    }
    console.log(this.archivos);

  }

  onSubmit(){
    const date = new Date(this.versionForm.get('ver_release_date')?.value).getTime() / 1000;
    const actual = new Date().getTime() / 1000;
    console.log("hora actual: ", actual);
    this.versionForm.patchValue({'ver_release_date': Math.trunc(date), 'descripcion': toHTML(this.versionForm.value.descripcion)});

    let write = this.versionForm.value;
    write['tags'] = this.tags

    if(!this.editar){
      write['has_files'] = this.imagenes.length > 0? true : this.archivos.length > 0? true : false;
      write['has_image'] = this.imagenes.length > 0? true : false;
      write['has_doc']   = this.archivos.length > 0? true : false;
      
      const that = this;

      this.fb.postCollectionFb("version", write)
        .then(
          function(resp){
            const docID = resp.id; 
            console.log(docID);
            if(write.has_image)that.fb.cargarImagenesFirebase(that.imagenes, `version/${docID}/image/`, actual, docID);
            if(write.has_doc) that.fb.cargarImagenesFirebase(that.archivos, `version/${docID}/docs/`, actual, docID);
          }
        )
        .catch(err=> console.log(err));
      
      
      console.log(write);

      Swal.fire("Versión creada con éxito!",'', "success")
          .then(ok => this.dialogRef.close());
      
      Swal.fire({
        title: '¿Desea notificar la nueva versión por correo?',
        showDenyButton: true,
        confirmButtonText: `Si`,
        denyButtonText: `No`,
        customClass: {
          confirmButton: 'order-1 right-gap',
          denyButton: 'order-3',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
          this.dialog.open(MailerComponent,{
            width: '80%',
            height: '50vh',
            disableClose:true
          })
        } else if (result.isDenied) {
          Swal.fire('Version registrada exitosamente', '', 'success').then(ok => this.dialogRef.close());
        }
      })

    }
    else{
      if(!write.has_files && this.imagenes.length > 0){
        write['has_files'] = this.imagenes.length > 0? true : false;
        const that = this;
        that.fb.cargarImagenesFirebase(that.imagenes, `version/${this.data[0].id}/files`, actual, this.data[0].id);
      }
      this.fb.updateCollectionFB("version", this.data[0].id, write);
      Swal.fire("Actualización exitosa!", '', 'success')
        .then(ok => this.dialogRef.close());
    }
  }

  cerrar(){
    this.dialogRef.close();
    this.dialog.open(MailerComponent,{
      height: '80vh',
      width: '60%',
      disableClose:true
    })
  }
  
  addTag(tag: string, tagTooltip: MatTooltip){
    if(tag.trim() === ''){ return }
    if(this.tags.includes(tag)){
      tagTooltip.message = "Etiqueta ya existe!";
      tagTooltip.show();
      setTimeout(() => { tagTooltip.message = "Presione enter para agregar la etiqueta" }, 2000);
      
      return
    }
    this.tags.push(tag);
    if(this.tags.length === 10){
      this.versionForm.controls['tags'].disable();
    }
  }

  removeTag(i: number){
    this.tags.splice(i,1);
    if(this.tags.length < 10){
      this.versionForm.controls['tags'].enable();
    }
  }

  /**
   * 
   * @param type 1: archivo, 0: foto 
   * @param index indice del elemento a borrar
   */

  removeFile(type: number, index: number){
    if(this.editar){
      if(type === 0){
        const aux: any = this.imagenes[index].archivo;
        Swal.fire({
          title: `¿Desea eliminar el archivo ${aux.nombre} de la base de datos?`,
          showCancelButton: true,
          confirmButtonText: "Si"
        }).then(res => {
          if(res.isConfirmed){
            this.fb.deleteFile(aux.id, 'version', aux.nombre, 'image');
            this.imagenes.splice(index, 1);
          } else {
            return
          }
        })
        
      }
      if(type === 1){
        const aux: any = this.archivos[index].archivo;
        Swal.fire({
          title: `¿Desea eliminar el archivo ${aux.nombre} de la base de datos?`,
          showCancelButton: true,
          confirmButtonText: "Si"
        }).then(res => {
          if(res.isConfirmed){
            this.fb.deleteFile(aux.id, 'version', aux.nombre, 'docs');
            this.archivos.splice(index, 1);
          } else {
            return
          }
        })
        
      }
    }
    else{
      if(type === 0) this.imagenes.splice(index, 1);
      if(type === 1) this.archivos.splice(index, 1);
    };

  }

}
