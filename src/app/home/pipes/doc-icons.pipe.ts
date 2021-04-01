import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docIcons'
})
export class DocIconsPipe implements PipeTransform {

  transform(value: string): unknown {
    const ext2 = value.split(".");
    const ext = ext2[ext2.length - 1];
    if(ext === "pdf") return "picture_as_pdf";
    else if(ext === "doc" || ext === "docx" || ext === "txt") return "article";
    else if(ext === "ppt" || ext === "pptx") return "auto_awesome_motion";
    else if(ext === "xls" || ext === "xlsx" ) return "table_view";
    else return "attach_file";
  }

}
