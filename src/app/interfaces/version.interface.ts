export interface version{
    data:{
        categoria: string;
        descripcion: string;
        id: string;
        ver_creado_por: string;
        ver_number: string;
        ver_release_date: {
            seconds: number;
            nanoseconds: number;
        }
    };
    id: string;

}