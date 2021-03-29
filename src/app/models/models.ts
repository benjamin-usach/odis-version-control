export class FileItem {
    public archivo: File;
    public nombreArchivo: string;
    public type: string;
    public url?: string;
    public created?: string;
    public estaSubiendo: boolean;
    public progreso: number;
    public status?: string;
  
    constructor(archivo: File) {
      this.archivo = archivo;
      this.nombreArchivo = archivo.name;
      this.type = archivo.type;
      this.estaSubiendo = false;
      this.progreso = 0;
    }
  }