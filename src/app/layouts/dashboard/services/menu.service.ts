import {inject, Injectable} from '@angular/core';
import {Observable, shareReplay} from "rxjs";
import {NavigationStore} from "../navigation/navigation.interface";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menu$: Observable<NavigationStore[]> = inject(HttpClient).get<NavigationStore[]>(environment.ApiUrl + 'menu')
    .pipe(
      shareReplay(1)
    )
}
