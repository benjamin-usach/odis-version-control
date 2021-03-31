export interface version{
    id: string;
    categoria: string;
    descripcion: string;
    ver_creado_por: string;
    ver_number: string;
    ver_release_date: number;
    ver_edited_date: number;
    ver_edited: number;
    has_files: boolean;
    has_image: boolean;
    has_doc: boolean;
    beta: boolean;
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

export interface categorias {
    id: string;
    nombre: string;
}

export interface MailList {
    id: string;
    nombre: string;
    list: string[];
}

