import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];

    if (cookieToken) {
      return true;
    } else {
      console.log('Kein Token, Umleitung zur Login-Seite');
      router.navigateByUrl('login');
      return false;
    }
  } else {
    console.log('Document is not defined, cannot check token');
    return false;
  }
};
