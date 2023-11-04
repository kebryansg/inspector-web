import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-asign',
  templateUrl: './asign.component.html',
  styleUrls: []
})
export class AsignFormularioComponent implements OnInit {

  slCategoria: number = -1;
  slActEconomica: number = -1;
  slFormulario: number = -1;
  slGrupo: number = -1;

  lsActEconomica: any[] = [];
  lsTipoEmpresa: any[] = [];

  lsGrupo: any[] = [];
  lsActividad: any[] = [];
  lsCategoria: any[] = [];

  lsFilterClasificacion: any[] = [];

  lsFormulario: any[] = [];
  selected: any[] = [];

  async ngOnInit() {

    /*
    let result = await Promise.all([
      this.crudService.SeleccionarAsync('acteconomica_combo'),
      this.crudService.SeleccionarAsync('tipoempresa_combo'),
      this.crudService.SeleccionarAsync('formulario_combo'),
      this.crudService.SeleccionarAsync('grupo_combo'),

    ]);

    this.lsActEconomica = result[0] as any[];
    this.lsTipoEmpresa = result[1] as any[];
    this.lsFormulario = result[2] as any[];
    this.lsGrupo = result[3] as any[];
    */

  }

  changeGrupo(event: any) {
    this.lsActividad = [...this.lsGrupo.find(row => row.ID == event).acttarifarios];
    this.lsCategoria = [...this.lsGrupo.find(row => row.ID == event).categorium];
  }

  onSelect({selected}: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  save() {
    let items = this.selected.map(item => item.ID);
    /*
    this.crudService.Insertar(items, `clasificacion_ls_asign/${this.slFormulario}`)
      .subscribe(res => {
        this.selected = this.lsFilterClasificacion = [];
        this.slActEconomica = this.slCategoria = this.slFormulario = null;
      });
    */
  }

}
