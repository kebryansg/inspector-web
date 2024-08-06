import {inject, Injectable, signal} from '@angular/core';
import {Annotation} from "../interfaces/annotation.interface";
import {ComponentForm, ComponentView, ImageEdit, ItemCatalog} from "../interfaces/form-edit.interface";
import {TypeInspection} from "../enums/type-inspection.enum";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {of} from "rxjs";
import {TypeComponentEnum} from "../enums/type-component.enum";

@Injectable()
export class FormEditService {

  private httpClient = inject(HttpClient);

  endpointBaseForm: string = environment.apiUrl + "formulario";

  _sections = new Map<number, any>();
  _components = signal<ComponentView[]>([]);
  private _itemCatalog = signal<ItemCatalog[]>([]);
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

  getComponentsToDetails() {
    return this._components().map(
      (component) => this.mapComponentToDetail(component)
    ).filter(component => !!component.Result)
  }

  private mapComponentToDetail = (component: ComponentView) => {
    return {
      idSection: component.idSection,
      idComponent: component.ID,
      typeComponent: component.typeComponent,
      Result: component.typeComponent == TypeComponentEnum.Qualitative ?
        this.findAttr(component.attribute, component.result ?? '')
        : component.result,
      descriptionComponent: component.description,
      descriptionSection: this._sections.get(component.idSection) ?? '',
    }
  }

  private findAttr = (attrs: any, code: string) => {
    return attrs.find((attr: any) => attr.code == code)!
  }

  //#endregion

  //#region ItemCatalog
  setInitCatalog(values: any[]) {
    this._itemCatalog.set(values);
  }

  get itemCatalog() {
    return this._itemCatalog.asReadonly();
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

  getMapAnnotations() {
    return this._listAnnotations()
      .map(annotation => {
        return {
          Observation: annotation.description,
          IdSection: annotation.idSection,
          TypeAnnotation: annotation.type,
          state: 'ACT',
        }
      })
  }

  //#endregion

  //#region Form
  setIdForm(id: number) {
    this.#idForm.set(id);
  }

  getConfigForm(idForm?: number) {
    //console.log(idForm)
    if (!idForm) return of([])

    return this.httpClient.get<any>(`${this.endpointBaseForm}/${idForm}/seccion/config`)
      .pipe(
        map<{ sections: any[], components: ComponentForm[], itemsCatalog: any[] }, any>(({sections, components, itemsCatalog}) => {
            const componentsView = components.map(mapComponentView);
            this.setInitComponents(componentsView);
            this.setInitCatalog(itemsCatalog);
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

