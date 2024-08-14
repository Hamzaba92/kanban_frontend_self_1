import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
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
export class RegisterComponent implements OnInit{
  firstname: string = '';
  lastname: string = '';
  eMail: string = '';
  username: string = '';
  password: string = '';
  confirm_password: string = '';
  csrfToken: string = '';

  progressbar: boolean = false;

  constructor(private http: HttpClient, public rout: Router) {

  }

  ngOnInit(){
    this.getCsrfToken();
  }

  getCsrfToken() {
    this.http.get('http://localhost:8000/api/csrf-token/').subscribe({
      next: (response: any) => {
        this.csrfToken = response.csrfToken;
        localStorage.setItem('csrftoken', this.csrfToken);
        document.cookie = `csrftoken=${this.csrfToken}; path=/`;
      },
      error: (error) => {
        console.error('Error fetching CSRF token:', error);
      }
    });
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

    const csrfToken = localStorage.getItem('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken ?? '',
       'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8000/api/register/', formData, { headers }).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        this.progressbar = false;
        this.rout.navigateByUrl('login');
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.progressbar = false;
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error:', error);
          console.error('Status Code:', error.status);
          console.error('Response Body:', error.error);
        }
      },
    });
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
