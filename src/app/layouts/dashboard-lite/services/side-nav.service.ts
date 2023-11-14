import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  collapsed = signal(false);
}
