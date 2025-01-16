import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxFormModule, DxTextBoxModule} from "devextreme-angular";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../../../../services/login.service";
import {NotificationService} from "@service-shared/notification.service";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxTextBoxTypes} from "devextreme-angular/ui/text-box";
import {DxButtonTypes} from "devextreme-angular/ui/button";
import {toSignal} from "@angular/core/rxjs-interop";
import {Profile} from "../../../../auth/interfaces/login.interface";

@Component({
    selector: 'app-profile',
  imports: [
    CardComponent,
    ItemControlComponent,
    DxTextBoxModule,
    ReactiveFormsModule,
    DxTextErrorControlDirective,
    DxFormModule,
  ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  #formBuilder = inject(FormBuilder);
  #loginService = inject(LoginService);
  #notificationService = inject(NotificationService);

  patternPass = '^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$';
  patternPassMessage = 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.'

  profile = toSignal(
    this.#loginService.userLogged(),
    {initialValue: {} as Profile}
  )

  //#region TextPassword
  passwordMode = signal<DxTextBoxTypes.TextBoxType>('password');
  passwordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.passwordMode.update(
        () => this.passwordMode() === 'text' ? 'password' : 'text'
      );
    },
  };

  confirmPasswordMode = signal<DxTextBoxTypes.TextBoxType>('password');
  confirmPasswordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.confirmPasswordMode.update(
        () => this.confirmPasswordMode() === 'text' ? 'password' : 'text'
      );
    },
  };

  repeatPasswordMode = signal<DxTextBoxTypes.TextBoxType>('password');
  repeatPasswordButton: DxButtonTypes.Properties = {
    icon: 'eyeopen',
    stylingMode: 'text',
    onClick: () => {
      this.repeatPasswordMode.update(
        () => this.repeatPasswordMode() === 'text' ? 'password' : 'text'
      );
    },
  };
  //#endregion

  passForm = this.#formBuilder.nonNullable.group({
    pass: new FormControl('', {
      validators: [Validators.required]
    }),
    newPass: new FormControl('', {
      validators: [Validators.required, Validators.pattern(this.patternPass)]
    }),
    repeatPass: new FormControl('', {
      validators: [Validators.required]
    }),
  })

  submitForm() {
    this.passForm.markAllAsTouched();
    if (this.passForm.invalid) {
      this.#notificationService.showSwalMessage({
        title: 'Formulario tiene validaciones pendientes',
        icon: 'warning'
      });
      return;
    }

    this.#notificationService.showSwalConfirm({
      title: '¿Está seguro de cambiar la contraseña?',
      text: 'Una vez cambiada la contraseña, deberá iniciar sesión nuevamente',
      icon: 'warning',
      confirmButtonText: 'Si, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCancelButton: true,
    }).then((result) => {
      if (!result) {
        return;
      }

      this.sendForm();

    });
  }

  sendForm() {
    this.#notificationService.showLoader();

    const {pass, newPass} = this.passForm.getRawValue();
    this.#loginService.resetPassword({
      Contrasena: pass,
      NContrasena: newPass,
    }).then(
      () => {
        this.#notificationService.closeLoader();
        this.#notificationService.showSwalMessage({
          title: 'Contraseña actualizada',
          icon: 'success',
        });
      }
    ).catch(
      (err) => {
        this.#notificationService.closeLoader();
        console.log(err);
        this.#notificationService.showSwalMessage({
          title: err.error.message,
          icon: 'error',
        });
      }
    );
  }

}
