import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';
import { VersionHistoryComponent } from '../../version-history.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(  private dialogRef: MatDialogRef<VersionHistoryComponent>,
                private fb: FirebaseService
    ) { }

  versionForm!: FormGroup;
  //ver_id_validator: RegExp = new RegExp('[0-9]{1,3}\.[0-9]{1,3}\.[0-9]');

  //TODO: VALIDACIONES!!

  post: Object = {}


  private initForm(){
    this.versionForm = new FormGroup({
      'categoria':        new FormControl(null, Validators.required),
      'descripcion':      new FormControl(null, Validators.required),
      'ver_creado_por':   new FormControl(null, Validators.required),
      'ver_release_date': new FormControl(null, Validators.required),
      'ver_number':       new FormControl("0.0.0", Validators.required)
    });

  }


  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(){
    this.post = this.versionForm.value;
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
