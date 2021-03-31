import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  images:any = [];
  active = '';

  constructor(
    public dialogRef: MatDialogRef<CarouselComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]) { }

  ngOnInit(): void {
    this.images = this.data[0]
    this.active = `id_${this.data[1]}`
    console.log(this.active);
  }

}
