import {AfterViewInit, Component, inject} from '@angular/core';
import {DxFormModule} from "devextreme-angular";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {debounceTime, map, Subject, switchMap} from "rxjs";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    DxFormModule,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  private loginService = inject(LoginService)
  router = inject(Router)

  loginData: any;
  message: string = '';
  production: boolean = false;
  ambiente: string = 'Production';
  buttonOptions: any = {
    text: 'Iniciar Sesión',
    type: 'success',
    useSubmitBehavior: true
  };

  $submitLogin: Subject<void> = new Subject<void>();

  ngAfterViewInit() {
    this.$submitLogin
      .pipe(
        debounceTime(500),
        map(() => this.loginData),
        switchMap(({Email, Password}) =>
          this.loginService.login({
            username: Email,
            password: Password
          })
        ),
      ).subscribe(() => {
      this.router.navigate([''])
    })
  }

}

