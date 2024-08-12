import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  firstname: string = '';
  lastname: string = '';
  eMail: string = '';
  username: string = '';
  password: string = '';
  confirm_password: string = '';

  progressbar: boolean = false;

  constructor(public rout: Router){}


  isFormValid(){
    return (
      this.firstname&&
      this.lastname&&
      this.eMail&&
      this.username&&
      this.password == this.confirm_password
    );
  }

  doPasswordsMatch() {
    return this.password && this.confirm_password && this.password === this.confirm_password;
  }

  registerUser(){
    
  }

  backToLogin(){
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
