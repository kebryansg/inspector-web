import {inject, Injectable, signal} from '@angular/core';
import {Annotation} from "../interfaces/annotation.interface";
import {ComponentForm, ComponentView, ImageEdit} from "../interfaces/form-edit.interface";
import {TypeInspection} from "../enums/type-inspection.enum";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class FormEditService {

  private httpClient = inject(HttpClient);

  endpointBaseForm: string = environment.apiUrl + "formulario";

  _sections = new Map<number, any>();
  _components = signal<ComponentView[]>([]);
  #idForm = signal<number>(1);

  private _images = signal<ImageEdit[]>([]);
  _listAnnotations = signal<Annotation[]>([]);

  private _coords = signal<{ latitude: number, longitude: number }>({latitude: 0, longitude: 0});
  private typeInspection = signal<TypeInspection>(TypeInspection.Commercial);

  //#region TypeInspection
  setTypeInspection(type: TypeInspection) {
    this.typeInspection.set(type);
  }

  get TypeInspection() {
    return this.typeInspection.asReadonly();
  }

  //#endregion

  //#region Coords
  get coords() {
    return this._coords.asReadonly();
  }

  setCoords(coords: { latitude: number, longitude: number }) {
    this._coords.set(coords);
  }

  //#endregion

  //#region Images
  get images() {
    return this._images.asReadonly();
  }

  setImages(images: ImageEdit[]) {
    this._images.set(images);
  }

  updateImages(image: ImageEdit[]) {
    this._images.update(ls => [...image]);
  }

  //#endregion

  //#region Components
  setInitComponents(values: any[]) {
    this._components.set(values);
  }

  get components() {
    return this._components.asReadonly();
  }

  changeValueComponent(id: number, value: any) {
    this._components.update(ls => {
      const idxComponent = ls
        .findIndex(item => item.ID == id);
      ls[idxComponent].result = value
      return [...ls]
    });
  }

  //#endregion

  //#region Annotations

  setAnnotations(annotations: Annotation[]) {
    this._listAnnotations.set(annotations);
  }

  addAnnotations(annotation: Annotation) {
    this._listAnnotations.update((list) => [...list, annotation]);
  }

  editAnnotation(annotation: Annotation) {
    this._listAnnotations.update((list) => {
      const idxFind = list.findIndex(item => item.id === annotation.id)
      list[idxFind] = annotation;
      return [...list]
    });
  }

  deleteAnnotations(id: string) {
    this._listAnnotations.update((list) => [...list.filter(annotation => annotation.id !== id)]);
  }

  get listAnnotations() {
    return this._listAnnotations.asReadonly();
  }

  //#endregion

  //#region Form
  setIdForm(id: number) {
    this.#idForm.set(id);
  }

  getConfigForm(idForm?: number) {
    //console.log(idForm)
    if(!idForm) return of([])

    return this.httpClient.get<any>(`${this.endpointBaseForm}/${idForm}/seccion/config`)
      .pipe(
        map<{ sections: any[], components: ComponentForm[] }, any>(({sections, components}) => {
            const componentsView = components.map(mapComponentView);
            this.setInitComponents(componentsView);
            return sections.map(section => {
              this._sections.set(section.ID, section);
              return {
                ...section,
                components: componentsView.filter(component => component.idSection == section.ID)
              }
            })
          }
        )
      )
  }

  get idForm() {
    return this.#idForm.asReadonly();
  }

  //#endregion

  clearData() {
    this._components.update(() => []);
    this._listAnnotations.set([]);
    this._images.set([]);
    this.typeInspection.set(TypeInspection.Commercial);
  }

}


const mapComponentView = (component: ComponentForm): ComponentView => {
  return {
    ID: component.ID,
    order: component.OrderComponent,
    idType: component.IDTipoComp,
    idSection: component.IDSeccion,
    description: component.Descripcion,
    state: component.Estado,
    attribute: component.Atributo,
    result: component.Result,
    typeComponent: `${component.idTipoComp.Code}`.trim()
  }
}

