import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, public router: Router) { }


  async login() {
    await this.getCsrfToken();
    const csrftoken = this.getCookieValue('csrftoken');
  
    if (!csrftoken) {
      console.error('CSRF token is undefined.');
      return;
    }
  
    const formData = {
      username: this.username,
      password: this.password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    });
  
    const options = {
      headers: headers,
      withCredentials: true
    };
  
    try {
      const response: any = await firstValueFrom(this.http.post('http://localhost:8000/api/login/', formData, options));
  
      if (response && response.message === 'Login successful') {
        console.log('Login successful', response);
  
        setTimeout(() => {
          this.router.navigateByUrl('board').then(() => {
            window.location.reload();
          });
        }, 1200);
      } else {
        throw new Error('Login failed'); 
      }
  
    } catch (error: any) {
      console.error('Login failed', error);
      this.errorMessage = error.error ? error.error.error : 'An unexpected error occurred.';
    }
  }

  async getCsrfToken() {
    try {
      const response: any = await firstValueFrom(this.http.get('http://localhost:8000/api/csrf-token/', { withCredentials: true }));
      console.log('CSRF Token Response:', response);
      if (response && response.csrfToken) {
        document.cookie = `csrftoken=${response.csrfToken}; path=/`;
      } else {
        console.error('CSRF Token nicht im Response gefunden.');
      }
    } catch (error) {
      console.error('Failed to retrieve CSRF token', error);
    }
  }
  
  getCookieValue(name: string): string {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  };

  openRegisterForms() {
    this.router.navigateByUrl('register');
  }

}
