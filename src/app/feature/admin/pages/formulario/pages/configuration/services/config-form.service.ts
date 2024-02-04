import {Injectable, signal} from "@angular/core";
import {IComponente, ISeccion} from "../interfaces/config.interfaces";


@Injectable()
export class ConfigFormService {

  private _sections = signal<ISeccion[]>([]);
  sections = this._sections.asReadonly();

  #showItemsInactive = signal(true);

  get showItemsInactive() {
    return this.#showItemsInactive.asReadonly();
  }

  changeShowItemsInactive(val: boolean) {
    this.#showItemsInactive.set(val);
  }

  setSections(sections: ISeccion[]) {
    this._sections.set([...sections]);
  }

  //#region Operations Sections
  addSection(itemSection: ISeccion) {
    itemSection.components = [];
    this._sections.update(sections =>
      [...sections, itemSection]
    );
  }

  updateItemSection(rowIndex: any, itemSection: ISeccion) {
    this._sections.update(sections => {
      sections[rowIndex] = itemSection
      return [
        ...sections
      ]
    });
  }

  removeSection(rowIndex: number) {
    this._sections.update(sections => {
      sections.splice(rowIndex, 1);
      return [
        ...sections
      ]
    })
  }

  toggleActiveSection(rowIndex: number, status: 'ACT' | 'INA') {
    this._sections.update(sections => {
      sections[rowIndex].Estado = status;
      return [
        ...sections
      ]
    });
  }

  //#endregion


  //#region Operations Components
  addComponent(rowIndexSection: number, itemComponent: IComponente) {
    this._sections.update(sections => {
        sections[rowIndexSection].components.push(itemComponent);
        return [...sections]
      }
    );
  }

  editComponent(rowIndexSection: number, rowIndexComponent: number, itemComponent: IComponente) {
    this._sections.update(sections => {
        sections[rowIndexSection].components[rowIndexComponent] = {...itemComponent};
        return [...sections]
      }
    );
  }

  removeComponent(rowIndexSection: number, rowIndexComponent: number) {
    this._sections.update(sections => {
        sections[rowIndexSection].components.splice(rowIndexComponent, 1);
        return [...sections]
      }
    );
  }

  toggleActiveComponent(rowIndexSection: number, rowIndexComponent: number, status: 'ACT' | 'INA') {
    this._sections.update(sections => {
        sections[rowIndexSection].components[rowIndexComponent].Estado = status;
        return [...sections]
      }
    );
  }

  //#endregion


}
