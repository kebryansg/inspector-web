export const ColumnsCommercial = [
  {
    dataField: "ID",
    caption: "Cód.",
    allowSearch: false,
    alignment: "center",
    allowHeaderFiltering: false,
  },
  {
    dataField: "FechaRegistro",
    caption: "Fecha Registro",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "FechaInspeccion",
    caption: "Fecha Inspeccion",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "Sector",
    allowHeaderFiltering: true,
    caption: "Sector",
  },
  {
    dataField: "Inspector",
    allowHeaderFiltering: false,
    caption: "Inspector",
  },
  {
    dataField: "RUC",
    allowHeaderFiltering: false,
    caption: "RUC",
  },
  {
    dataField: "RazonSocial",
    allowHeaderFiltering: false,
    caption: "Razón Social",
  },
  {
    dataField: "NombreComercial",
    allowHeaderFiltering: false,
    caption: "Nombre Comercial",
  },

]


export const ColumnsConstruction = [
  {
    dataField: "Id",
    caption: "Cód.",
    alignment: "center",
    allowSearch: false,
    allowHeaderFiltering: false,
  },
  {
    dataField: "created_at",
    caption: "Fecha Registro",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "inspection_at",
    caption: "Fecha Inspección",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "collaborator",
    caption: "Inspector Asignado",
    allowHeaderFiltering: false,
  },
  {
    dataField: "identifier",
    caption: "Identificación Responsable",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "entity",
    caption: "Responsable",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "name_project",
    caption: "Nombre de Proyecto",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "address",
    caption: "Dirección",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "parroquia",
    caption: "Parroquia",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "sector",
    caption: "Sector",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "area_m2",
    caption: "Área M2",
    allowHeaderFiltering: true,
    alignment: "right",
  },
]

export const ColumnsVehicle = [
  {
    dataField: "Id",
    caption: "Cód.",
    alignment: "center",
    allowSearch: false,
    allowHeaderFiltering: false,
  },
  {
    dataField: "created_at",
    caption: "Fecha Registro",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "inspection_at",
    caption: "Fecha Inspección",
    dataType: "date",
    format: "yyyy, MMMM dd",
    allowHeaderFiltering: false,
  },
  {
    dataField: "collaborator",
    caption: "Inspector Asignado",
    allowHeaderFiltering: false,
  },
  {
    dataField: "entity",
    caption: "Propietario",
    allowHeaderFiltering: true,
    alignment: "center",
  },
  {
    dataField: "current_plate",
    caption: "Placa",
    allowHeaderFiltering: true,
    alignment: "center",
  },
]
