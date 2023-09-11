export interface GrupoTarifario {
    ID: number;
    Nombre: string;
    Descripcion: string;
    Estado: string;
    acttarifarios: ActividadTarifario[];
    categorias: CategoriaGrupo[];
}


export interface ActividadTarifario {
    ID: number;
    Nombre: string;
    Descripcion: string;
    Estado: string;
}

export interface CategoriaGrupo {
    ID: number;
    Nombre: string;
    Descripcion: string;
    Estado: string;
}
