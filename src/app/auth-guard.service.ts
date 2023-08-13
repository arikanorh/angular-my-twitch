import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './model/User';
import { TwitchService } from './twitch.service';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public twitch: TwitchService, public router: Router) { }

  canActivate() {

    return this.twitch.getUser().pipe(map(
      (user: User) => {
        if (user)
          return true;
        else {
          this.router.navigate(["login"]);
          return false;
        }
      }
    ))






  }
}