import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InspectionReportService {

  dataInspections = signal(
    [
      {
        "idInspection": 21,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "RVW",
        "reasonSocial": "VERA LOOR PEDRO RENE",
        "nameCommercial": "COMEDOR PAPI POLLO VERITA",
        "Inspector": "CARLOS PARRAGA",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 22,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "APR",
        "reasonSocial": "BONES CABEZAS SARA LOURDES",
        "nameCommercial": "DINA´S",
        "Inspector": "CARLOS PARRAGA",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 23,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "REP",
        "reasonSocial": "CORDOVA MENDOZA BOLIVAR ANTONIO",
        "nameCommercial": "BIENVENIDO A",
        "Inspector": "CARLOS PARRAGA",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 24,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "PEN",
        "reasonSocial": "ANCHUNDIA MEND",
        "nameCommercial": "SODA BAR ROBINFLOR",
        "Inspector": "CARLOS PARRAGA",
        "sector": "Barrio El Paraiso",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 25,
        "dateInspection": "2024-03-19 01:17:34.0000000",
        "state": "APR",
        "reasonSocial": "HOLGUIN LUCAS ANGELA MARGARITA",
        "nameCommercial": "MARGARITA´S PIZZERIA",
        "Inspector": "PILAR GUZMAN",
        "sector": "Barrio El Paraiso",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 26,
        "dateInspection": "2024-03-19 12:11:52.0000000",
        "state": "APR",
        "reasonSocial": "RONQUILLO PALACIOS JESSICA FERNANDA",
        "nameCommercial": "COMEDOR ARELYS Y ARLENYS",
        "Inspector": "PILAR GUZMAN",
        "sector": "Recinto Nueva Zulema ",
        "parroquia": "RECINTOS"
      },
      {
        "idInspection": 27,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "PEN",
        "reasonSocial": "ACTIVIDADES DE SALON DE BILLAR",
        "nameCommercial": "SALON D",
        "Inspector": "PILAR GUZMAN",
        "sector": "Recinto Nueva Zulema ",
        "parroquia": "RECINTOS"
      },
      {
        "idInspection": 28,
        "dateInspection": "2024-01-18 13:08:15.2466667",
        "state": "APR",
        "reasonSocial": "SANTANA BUENO RIDER HUMBERTO",
        "nameCommercial": "GOOD KARAOKE",
        "Inspector": "PILAR GUZMAN",
        "sector": "Recinto Los Angeles",
        "parroquia": "PATRICIA PILAR"
      },
      {
        "idInspection": 30,
        "dateInspection": "2024-03-19 16:10:48.0000000",
        "state": "REP",
        "reasonSocial": "JIMENEZ SABANDO S",
        "nameCommercial": "SALON DE BILLAR JV",
        "Inspector": "PILAR GUZMAN",
        "sector": "Cooperativa Santa Rosa",
        "parroquia": "7 DE OCTUBRE"
      },
      {
        "idInspection": 31,
        "dateInspection": "2024-03-18 22:21:06.5100000",
        "state": "PEN",
        "reasonSocial": "BONES CABEZAS SARA LOURDES",
        "nameCommercial": "DINA´S",
        "Inspector": "PILAR GUZMAN",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 32,
        "dateInspection": "2024-03-18 22:21:06.5100000",
        "state": "PEN",
        "reasonSocial": "SANTANA BUENO RIDER HUMBERTO",
        "nameCommercial": "GOOD KARAOKE",
        "Inspector": "PILAR GUZMAN",
        "sector": "Recinto Los Angeles",
        "parroquia": "PATRICIA PILAR"
      },
      {
        "idInspection": 33,
        "dateInspection": "2024-03-18 22:21:06.5100000",
        "state": "PEN",
        "reasonSocial": "VERA BASURTO ANDRES ASUNCION ",
        "nameCommercial": "BILLAR 4 HERMANOS",
        "Inspector": "PILAR GUZMAN",
        "sector": "Barrio Nueva Union",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 35,
        "dateInspection": "2024-03-19 08:57:52.6000000",
        "state": "PEN",
        "reasonSocial": "RONQUILLO PALACIOS JESSICA FERNANDA",
        "nameCommercial": "COMEDOR ARELYS Y ARLENYS",
        "Inspector": "PILAR GUZMAN",
        "sector": "Recinto Nueva Zulema ",
        "parroquia": "RECINTOS"
      },
      {
        "idInspection": 36,
        "dateInspection": "2024-03-19 08:57:52.6000000",
        "state": "PEN",
        "reasonSocial": "VERA LOOR PEDRO RENE",
        "nameCommercial": "COMEDOR PAPI POLLO VERITA",
        "Inspector": "PILAR GUZMAN",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      },
      {
        "idInspection": 37,
        "dateInspection": "2024-03-19 08:57:52.6000000",
        "state": "PEN",
        "reasonSocial": "BRAVO BRAVO ALICIA ALEGRIA",
        "nameCommercial": "COMEDOR VANESSITA",
        "Inspector": "PILAR GUZMAN",
        "sector": "RECINTO SOLEDAD ",
        "parroquia": "RECINTOS"
      },
      {
        "idInspection": 38,
        "dateInspection": "2024-03-19 08:57:52.6000000",
        "state": "PEN",
        "reasonSocial": "CORTEZ MENDOZA YADIRA MONSERRATE",
        "nameCommercial": "COMEDOR YADIRA",
        "Inspector": "PILAR GUZMAN",
        "sector": "Sector 10",
        "parroquia": "PATRICIA PILAR"
      },
      {
        "idInspection": 39,
        "dateInspection": "2024-03-19 08:57:52.6000000",
        "state": "PEN",
        "reasonSocial": "RODRIGUEZ INTRIAGO CARLOS ALFREDO",
        "nameCommercial": "ASADERO POLL",
        "Inspector": "PILAR GUZMAN",
        "sector": "Barrio Central",
        "parroquia": "SAN JACINTO DE BUENA FE"
      }
    ]
  )
}
