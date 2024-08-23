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


  async ngOnInit() {
    await this.getCsrfToken();
  }

  login() {
    const csrftoken = this.getCookieValue('csrftoken');
    console.log('Cookie geholt', csrftoken);
    
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
      const response = firstValueFrom(this.http.post('http://localhost:8000/api/login/', formData, options));
      console.log('Login successful', response);
      setTimeout(()=>{
        this.router.navigateByUrl('board');
      }, 1200);
       
    } catch (error: any) {
      console.error('Login failed', error);
      this.errorMessage = error.error.error;
    }
  }
  

  async getCsrfToken() {
    try {
      const response: any = await firstValueFrom(this.http.get('http://localhost:8000/api/csrf-token/', { withCredentials: true }));
      console.log('CSRF token erhalten:', response);
  
      if (response && response.csrftoken) {
        document.cookie = `csrftoken=${response.csrftoken}; path=/`;
      }
    } catch (error) {
      console.error('Failed to retrieve CSRF token', error);
    }
  }
  

  getCookieValue(name: string): string{
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  };
  


  openRegisterForms() {
    this.router.navigateByUrl('register');
  }



}
