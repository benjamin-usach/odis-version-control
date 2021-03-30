export interface version{
    id: string;
    categoria: string;
    descripcion: string;
    ver_creado_por: string;
    ver_number: string;
    ver_release_date: number;
    has_files: boolean;
    tags?: string[];
    noHtml?: string;
    archivos: any[];
}

export interface Item {
    id: any;
    nombre: string;
    type: string;
    url: any;
    created: any;
}