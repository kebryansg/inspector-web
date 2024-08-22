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
