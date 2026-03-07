import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {User, UserService} from '../api/generated';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserS {
  // 1. Injection du client généré (Basse-Niveau)
  private readonly userApi = inject(UserService);

  // 2. État réactif partagé (Signal)
  public userFound: WritableSignal<User | null> = signal<User | null>(null);

  // 3. Logique métier : Rechercher
  public getRemoteUser(username: string): void {
    this.userApi.getUserByName(username).subscribe({
      next: (user: User) => this.userFound.set(user),
      error: () => this.userFound.set(null)
    });
  }

  // 4. Logique métier : Créer
  public createRemoteUser(user: User): Observable<void> {
    return this.userApi.createUser(user).pipe(
      tap(() => console.log('Utilisateur créé avec succès'))
    );
  }

}
