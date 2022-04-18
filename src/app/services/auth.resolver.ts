import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<Observable<Object>> {
  showRegisterPage!: boolean;
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Object> {
    switch (route.routeConfig?.path) {
      case 'register':
        this.showRegisterPage = true;
        break;
      case 'login':
        this.showRegisterPage = false;
        break;
    }
    return of({ showRegisterPage: this.showRegisterPage });
  }
}
