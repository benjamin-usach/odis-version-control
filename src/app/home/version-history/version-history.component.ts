import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {


  placeholder: number[] = [0,1,2,3,4]

  selected = -1;

  constructor() { }

  ngOnInit(): void {

  }

  expand(){}

}
