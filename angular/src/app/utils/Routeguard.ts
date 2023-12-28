import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TokenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return  false;
    }
    return true; 
}}

