import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'ODIS Version History';  
  admin = false;

  constructor(
    private fb: FirebaseService
  ) {}

  ngOnInit(){
    if(localStorage.getItem("admin") == "true"){
      this.admin=true
    }
  
  }

  setAdmin(){
    localStorage.setItem("admin", "true");
  }

  unsetAdmin(){
    localStorage.removeItem("admin");
  }

}