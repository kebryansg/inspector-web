import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {DxFormModule, DxLoadPanelModule} from "devextreme-angular";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {debounceTime, map, Subject, switchMap} from "rxjs";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    DxFormModule,
    NgOptimizedImage,
    DatePipe,
    DxLoadPanelModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  private loginService = inject(LoginService)
  router = inject(Router)

  loadingVisible = signal(false);


  date: Date = new Date();
  loginData: any;
  message: string = '';
  ambiente = environment.ambiente;
  buttonOptions: any = {
    text: 'Iniciar Sesión',
    type: 'success',
    useSubmitBehavior: true,
  };

  submitLogin: Subject<void> = new Subject<void>();

  login$ = this.submitLogin.asObservable()
    .pipe(
      debounceTime(500),
      tap(() => this.loadingVisible.set(true)),
      map(() => this.loginData),
      switchMap(({Email, Password}) =>
        this.loginService.login({
          username: Email,
          password: Password
        })
      ),
      takeUntilDestroyed()
    )

  ngOnInit() {
    this.login$
      .subscribe({
        next: (response) => {
          this.loadingVisible.set(false);
          if (response.status) {
            this.router.navigate([''])
          } else {
            this.message = response.error.message;
          }
        }
      })
  }

}

