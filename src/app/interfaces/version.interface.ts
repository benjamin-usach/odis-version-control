export interface version{
    data:{
        categoria: string;
        descripcion: string;
        id: string;
        ver_creado_por: string;
        ver_number: string;
        ver_release_date: number;
        files: any[];
        tags?: string[];
    };
    id: string;
}

export interface Item {
    id: any;
    nombre: string;
    type: string;
    url: any;
    created: any;
  }