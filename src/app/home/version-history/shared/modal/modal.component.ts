import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';
import { Editor, Toolbar } from 'ngx-editor';
import { schema } from 'ngx-editor/schema';
import { toHTML, toDoc } from 'ngx-editor';
import { FileItem } from 'src/app/models/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';


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
  archivos: FileItem[] = [];

  tags: string[] = [];


  constructor(  private dialogRef: MatDialogRef<ModalComponent>,
                private fb: FirebaseService,
                @Inject(MAT_DIALOG_DATA) public data:version
    ) { }

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
      'files':            new FormControl( [],      [RxwebValidators.file({maxFiles: 8})])
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

    if(this.data.id){
      this.editar = true;
      this.tags = this.data.tags? this.data.tags : [];
      const date =  new Date(this.data.ver_release_date*1000 ).toISOString().slice(0,10);
      console.log(date);
      this.versionForm.setValue({
        'categoria':          this.data.categoria,
        'descripcion':        toDoc(this.data.descripcion),
        'ver_creado_por':     this.data.ver_creado_por,
        'ver_release_date':   date,
        'ver_number':         this.data.ver_number,
        'tags':               '',
        'files':              []
      });
    } 

    console.log(this.editar)
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


   onFileSelected(event: any){
    console.log(event.target.files);
    console.log(this.archivos)
    
    //Pasar a base 64
    // let reader = new FileReader()

    // if(event.target.files && event.target.files.length) {
    //   const [file] = event.target.files;
    //   reader.readAsDataURL(file);

    //   reader.onload = () => {
    //     this.versionForm.patchValue({'files': reader.result});
    //   }
    // };

    // console.log(this.versionForm.value);

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

    var write = this.versionForm.value;
    write['tags'] = this.tags

    if(!this.editar){
      write['has_files'] = this.archivos.length > 0? true : false;
      const that = this;
      this.fb.postCollectionFb("version", write)
        .then(
          function(resp){
            const docID = resp.id; 
            console.log(docID);
            that.fb.cargarImagenesFirebase(that.archivos, `version/${docID}/files`, actual, docID);
          }
        )
        .catch(err=> console.log(err));
      
      
      Swal.fire("Versión creada con éxito!",'', "success")
          .then(ok => this.dialogRef.close());
    }
    else{
      this.fb.updateCollectionFB("version", this.data.id, write);
      Swal.fire("Actualización exitosa!", '', 'success')
        .then(ok => this.dialogRef.close());
    }
  }

  cerrar(){
    this.dialogRef.close();
  }

  addTag(tag: string){
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
}
