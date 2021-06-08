import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const TOKEN_KEY = 'user-access-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<any>;
  private authState = new BehaviorSubject(null);

  constructor(private storage: Storage, private router: Router) {
    this.initStorage();

    this.loadUser();
    this.user = this.authState.asObservable().pipe(filter((resp) => resp));
  }

  async initStorage() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storage = await this.storage.create();
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then((data) => {
      console.log('Loaded user: ', data);
      if (data) {
        this.authState.next(data);
      } else {
        this.authState.next({ email: null, role: null });
      }
    });
  }

  signIn(credentials): Observable<any> {
    let email = credentials.email;
    let pw = credentials.pw;
    let user = null;

    if (email === 'admin' && pw === 'admin') {
      user = { email, role: 'ADMIN' };
    } else if (email === 'user' && pw === 'user') {
      user = { email, role: 'USER' };
    }

    this.authState.next(user);
    this.storage.set(TOKEN_KEY, user);

    return of(user);
  }

  async signOut() {
    await this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
    this.router.navigateByUrl('/login');
  }
}
