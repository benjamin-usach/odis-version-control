import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { version } from 'src/app/interfaces/version.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(  private dialogRef: MatDialogRef<ModalComponent>,
                private fb: FirebaseService,
                @Inject(MAT_DIALOG_DATA) public data:version
    ) { }

  versionForm!: FormGroup;
  //ver_id_validator: RegExp = new RegExp('[0-9]{1,3}\.[0-9]{1,3}\.[0-9]');

  //TODO: VALIDACIONES!!
  
  editar = false;
  


  private initForm(){
    this.versionForm = new FormGroup({
      'categoria':        new FormControl( null,    Validators.required),
      'descripcion':      new FormControl( null,    Validators.required),
      'ver_creado_por':   new FormControl( null,    Validators.required),
      'ver_release_date': new FormControl( null,    Validators.required),
      'ver_number':       new FormControl( "0.0.0", Validators.required)
    });

  }


  ngOnInit(): void {

    this.initForm();

    if(this.data.id){
      this.editar = true;

      const date =  new Date(this.data.data.ver_release_date*1000 ).toISOString().slice(0,10);

      this.versionForm.setValue({
        'categoria':          this.data.data.categoria,
        'descripcion':        this.data.data.descripcion,
        'ver_creado_por':     this.data.data.ver_creado_por,
        'ver_release_date':   date,
        'ver_number':         this.data.data.ver_number
      });
    } 

    console.log(this.editar)
  }

  onSubmit(){
    const date = new Date(this.versionForm.get('ver_release_date')?.value).getTime() / 1000;
    this.versionForm.patchValue({'ver_release_date': Math.trunc(date)});
    this.fb.postCollectionFb("version", this.versionForm.value);
    Swal.fire("Versión creada con éxito!",'', "success")
        .then(ok => this.dialogRef.close());
  }

  cerrar(){
    this.dialogRef.close();
  }

}
