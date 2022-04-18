import { Component, OnInit } from '@angular/core';
import { AuthResolver } from 'src/app/services/auth.resolver';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/models/user.model';

export function createPasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const hasLowerCase = /[a-z]+/.test(value);

    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid
      ? {
          hasUpperCase: !hasUpperCase,
          hasLowerCase: !hasLowerCase,
          hasNumeric: !hasNumeric,
        }
      : null;
  };
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  dontHaveAccount!: boolean;
  registerForm = this.fb.group({
    'username-register': [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    'contact-register': [
      '',
      {
        validators: [Validators.required, Validators.pattern('^\\d{10}$')],
        updateOn: 'submit',
      },
    ],
    'email-register': [
      '',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      },
    ],
    'password-register': [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          createPasswordStrengthValidator(),
        ],
        updateOn: 'submit',
      },
    ],
  });


  loginForm = this.fb.group({
    'email-login': [
      '',
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
    'password-login': [
      '',
      {
        validators: [
          Validators.required
        ],
        updateOn: 'submit',
      },
    ],
  });

  showAlert = false
  isSuccess = false
  alertMsg = ''


  constructor(
    public authResolver: AuthResolver,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dontHaveAccount = this.route.snapshot.data['message'].showRegisterPage;

    console.log(this.registerForm);
  }

  onSubmitRegister(): void {
    this.markFormAsDirty(this.registerForm, 'registerForm');
    if (this.registerForm.invalid) {
      return
    }
    const url = 'http://localhost:3000/api/v1/auth/register';
    const body: User = {
      username: this.getFormControl("username-register", 'registerForm')?.value,
      contact: this.getFormControl("contact-register", 'registerForm')?.value,
      email: this.getFormControl("email-register", 'registerForm')?.value,
      password: this.getFormControl("password-register", 'registerForm')?.value,
    }
    this.dataService.postData(url, body).subscribe(
      data => {
        this.showAlert = true
        this.isSuccess = true
        this.alertMsg = data.msg
        setTimeout(() => {
        this.showAlert = false;
this.router.navigate(['/', 'auth', 'login'])
        }, 2000);
      },
      error => {
        this.showAlert = true
        this.alertMsg = 'register error'
        setTimeout(() => {
          this.showAlert = false;
          }, 2000);
      }
    )
  }

  onSubmitLogin(): void {
    this.markFormAsDirty(this.loginForm, 'loginForm');
    if (this.loginForm.invalid) {
      return
    }
    const url = 'http://localhost:3000/api/v1/auth/login';
    const body: User = {
      email: this.getFormControl("email-login", 'loginForm')?.value,
      password: this.getFormControl("password-login", 'loginForm')?.value,
    }
    this.dataService.postData(url, body).subscribe(
      data => {
        this.showAlert = true
        this.isSuccess = true
        this.alertMsg = data.msg
        setTimeout(() => {
        this.showAlert = false;
        }, 2000);
      },
      error => {
        this.showAlert = true
        this.alertMsg = error.msg
        setTimeout(() => {
          this.showAlert = false;
          }, 2000);
      }
    )

  }

  getFormControl(val: string, formType: string): AbstractControl | null {

let form!: FormGroup


    switch (true) {

      case formType === 'registerForm':
        form = this.registerForm
        break;
        case formType === 'loginForm':
          form = this.loginForm
          break;

    }

    return form?.get(val)


  }

  markFormAsDirty(form: FormGroup, formType: string): void {
    for (const key in form.controls) {
      this.getFormControl(key, formType)?.markAsDirty();
    }
  }

  createErrorMessage(val: string, formType: string): {
    errorMessage: string;
    showError: boolean;
  } {
    let errorMessage = '';
    let showError = false;
    let value = this.getFormControl(val, formType)?.value;
    switch (val) {
      case `username-${formType === 'registerForm' ? 'register': 'login'}`:
        switch (true) {
          case this.getFormControl(val, formType)?.hasError('required'):
            errorMessage = 'Username is req';
            showError = true;
            break;
        }
        break;
      case `contact-${formType === 'registerForm' ? 'register': 'login'}`:
        switch (true) {
          case this.getFormControl(val, formType)?.hasError('required'):
            errorMessage = 'Phone no is req';
            showError = true;
            break;
          case !new RegExp(
            this.getFormControl(val, formType)?.errors?.pattern.requiredPattern,
            'i'
          ).test(value):
            errorMessage = 'Phone no is not valid';
            showError = true;
            break;
        }
        break;
      case `email-${formType === 'registerForm' ? 'register': 'login'}`:
        switch (true) {
          case this.getFormControl(val, formType)?.hasError('required'):
            errorMessage = 'Email is req';
            showError = true;
            break;
          case this.getFormControl(val, formType)?.hasError('email'):
            errorMessage = 'Email is not valid';
            showError = true;
            break;
        }
        break;
      case `password-${formType === 'registerForm' ? 'register': 'login'}`:
        switch (true) {
          case this.getFormControl(val, formType)?.hasError('required'):
            errorMessage = 'Password is req';
            showError = true;
            break;
          case this.getFormControl(val, formType)?.hasError('minlength'):
            errorMessage = 'Password should be min 8 characters long';
            showError = true;
            break;
          case this.getFormControl(val, formType)?.hasError('hasLowerCase'):
            errorMessage = 'Password should contain one lowercase letter';
            showError = true;
            break;
          case this.getFormControl(val, formType)?.hasError('hasUpperCase'):
            errorMessage = 'Password should contain one uppercase letter';
            showError = true;
            break;
          case this.getFormControl(val, formType)?.hasError('hasNumeric'):
            errorMessage = 'Password should contain one digit';
            showError = true;
            break;
        }
        break;
    }

    return { errorMessage, showError };
  }
}
