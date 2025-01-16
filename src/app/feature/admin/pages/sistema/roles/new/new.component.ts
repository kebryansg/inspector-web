import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuCrudService} from "../../services/menu-crud.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './new.component.scss',
    ],
    standalone: false
})
export class NewRolComponent {

  private menuService: MenuCrudService = inject(MenuCrudService);
  private router: Router = inject(Router)
  private route: ActivatedRoute = inject(ActivatedRoute);

  lsSubModulos$: Observable<any[]> = this.menuService.getSubModulos();
  selected: any[] = [];

  cancel() {
    this.router.navigate(['../../../roles'], {relativeTo: this.route});
  }

  loadRol(id: string) {
    /* return this.crudService.Seleccionar(`rol/` + id)
       .pipe(
         pluck<any, any[]>('Modulos'),
         tap(ls => this.selected = ls)
       );*/
  }
}
