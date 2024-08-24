import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  firstname: string = '';
  lastname: string = '';
  eMail: string = '';
  username: string = '';
  password: string = '';
  confirm_password: string = '';
  csrfToken: string = '';

  progressbar: boolean = false;
  formErrors: { field: string, message: string }[] = [];
  successMessage: string = '';

  constructor(private http: HttpClient, public rout: Router) {

  }

  ngOnInit() {
    this.getCsrfToken();
  }

  async getCsrfToken() {
    await this.http.get('http://localhost:8000/api/csrf-token/').subscribe({
      next: (response: any) => {
        this.csrfToken = response.csrfToken;
        document.cookie = `csrftoken=${this.csrfToken}; path=/`;
      },
      error: (error) => {
        console.error('Error fetching CSRF token:', error);
      }
    });
  }

  getCookieValue(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  isFormValid() {
    return (
      this.firstname &&
      this.lastname &&
      this.eMail &&
      this.username &&
      this.password == this.confirm_password
    );
  }

  doPasswordsMatch() {
    return this.password && this.confirm_password && this.password === this.confirm_password;
  }

  registerUser() {
    if (!this.isFormValid()) {
      return;
    }

    this.progressbar = true;

    const formData = {
      first_name: this.firstname,
      last_name: this.lastname,
      email: this.eMail,
      username: this.username,
      password1: this.password,
      password2: this.confirm_password,
    };

    const csrfToken = this.getCookieValue('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken ?? '',
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8000/api/register/', formData, { headers }).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        this.progressbar = false;
        this.showSuccessBanner();
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.progressbar = false;
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error:', error);
          this.displayErrors(error.error.errors);
        }
      },
    });
  }

  showSuccessBanner() {
    this.successMessage = 'Successfully Registered';
    setTimeout(() => {
      this.successMessage = '';
      this.rout.navigateByUrl('login');
    }, 3000);
  }

  displayErrors(errors: any) {
    this.formErrors = [];
    for (const [key, value] of Object.entries(errors)) {
      this.formErrors.push({ field: key, message: value as string });
    }
  }

  backToLogin() {
    this.rout.navigateByUrl('login');
  }

  getErrorMessage(control: NgModel): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Invalid E-Mail format';
    } else {
      return '';
    }
  }


}
