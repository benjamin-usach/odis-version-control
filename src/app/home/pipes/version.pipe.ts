import { Pipe, PipeTransform } from '@angular/core';
import { categorias } from 'src/app/interfaces/version.interface';

@Pipe({
  name: 'version'
})
export class VersionPipe implements PipeTransform {

  transform(value: string, cats: categorias[]): string {
    for(let i = 0; i < cats.length; i++){
      if(cats[i].id === value){
        return cats[i].nombre;
      }
    }
    return "N/A";
  }

}
