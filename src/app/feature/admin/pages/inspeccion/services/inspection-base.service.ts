import {Injectable} from '@angular/core';
import {InspectionServiceBase} from "../interfaces/inspection-service.interface";
import { Observable } from 'rxjs';

@Injectable()
export class InspectionBaseService implements InspectionServiceBase<any> {
    generateFileReport(id: number): Observable<any> {
        throw new Error('Method not implemented.');
    }
    getFileContentResult(id: number): Observable<any> {
        throw new Error('Method not implemented.');
    }
    getById(id: number): Observable<any> | Promise<any> {
        return Promise.resolve({});
    }
}
