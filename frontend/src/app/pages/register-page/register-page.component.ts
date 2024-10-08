import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();
  registerForm!: FormGroup;
  isSubmitted: boolean = false;
  errorMsg: string = '';
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  get fc() {
    return this.registerForm.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this._fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  onSubmit(): void {
    const { name, lastName, address, email, password, confirmPassword } = this.registerForm?.value;
    if(this.registerForm?.invalid) {
      this.isSubmitted = true;
    } else if(this.registerForm?.valid) {
      if(confirmPassword !== password) {
        this.errorMsg = "Passwords should match";
        return;
      } else {
        const registerPayload: IUserRegister = {
          name: name,
          lastName: lastName,
          address: address,
          email: email,
          password: password
        }
        this.isSubmitted = false;
        this._userService
        .register(registerPayload)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res: IUserRegister) => {
            if(!res) return;
            this._toastr.success('Registration successful!', 'Success');
            setTimeout(() => {
              this._router.navigate(['/login']);
            }, 1000);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            if(err?.status === 409) {
              this.errorMsg = err?.error?.message;
            }
          },
        });
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
