import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VersionHistoryComponent } from '../../version-history.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<VersionHistoryComponent>) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close();
  }

}
