import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('csrftoken') : null;



  if (token) {
    return true;
  } else {
    console.log('Kein Token, Umleitung zur Login-Seite');
    router.navigateByUrl('login');
    return false;
  }



};