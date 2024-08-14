import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient, public router: Router){}


login(){
  const formData = {
  username: this.username,
  password: this.password
  };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  this.http.post('http://localhost:8000/api/login/', formData, { headers }).subscribe({
    next: (response) => {
      console.log('Login successful', response);
        this.router.navigateByUrl('board'); 
    },
    error: (error) => {
      console.error('Login failed', error);
      this.errorMessage = error.error.error;
    }
  });

}

openRegisterForms(){
  this.router.navigateByUrl('register');
}

}
