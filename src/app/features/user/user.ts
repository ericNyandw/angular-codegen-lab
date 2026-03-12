import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 1. IL MANQUAIT L'IMPORT DU DTO : on l'importe avec un alias pour être sûr
import { User as UserDTO } from '../../api/generated';
import { UserS } from '../../services/user-s';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
// 2. RENOMMER LA CLASSE : User -> UserComponent
export class User {
  private readonly userService = inject(UserS);

  public userFound = this.userService.userFound;
  public searchName = signal<string>('');
  public userList = signal<string[]>([]);

  // 3. UTILISER LE TYPE DTO : On utilise UserDTO ici
  public newUserForm: UserDTO = this.initEmptyUser();

  private initEmptyUser(): UserDTO {
    return {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      userStatus: 1
    };
  }

  public onSearch(name?: string): void {
    const term = name || this.searchName();
    if (term) {
      this.searchName.set(term);
      this.userService.getRemoteUser(term);
    }
  }

  public onCreate(): void {
    if (!this.newUserForm.username) {
      alert("Le username est obligatoire !");
      return;
    }

    // 4. TYPAGE ICI AUSSI : On utilise UserDTO
    const userToCreate: UserDTO = {
      ...this.newUserForm,
      id: Date.now()
    };

    this.userService.createRemoteUser(userToCreate).subscribe({
      next: () => {
        this.userList.update(list => {
          return list.includes(userToCreate.username!) ? list : [...list, userToCreate.username!];
        });
        this.newUserForm = this.initEmptyUser();
        alert('✅ Utilisateur créé avec succès sur le serveur !');
      },
      error: (err) => {
        console.error("Erreur de création", err);
      }
    });
  }
}
