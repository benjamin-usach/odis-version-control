import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'versionHistory';  

  

  obj = {
    categoria: "jICcX0aawQh2Cm4eMsNS",
    descripcion: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure voluptas eligendi magni, fugit quidem quaerat. Labore ratione, obcaecati",
    ver_creado_por: "benjamin.bravo",
    ver_number: "1.0.0",
    ver_release_date: {
      seconds: 0,
      nanoseconds: 0
    }
  }

  constructor(
    private fb: FirebaseService
  ) {}

  ngOnInit(){
  }


  agregar(){
    const today = new Date().getTime() / 1000;
    this.obj.ver_release_date.seconds = Math.trunc(today);
    this.fb.postCollectionFb("version", this.obj);
  }

  verDatos(){
    this.fb.getCollectionfb("version").subscribe(data => console.log(data));

  }

}