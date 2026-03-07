import { Component, inject, signal } from '@angular/core';
import { User } from './api/generated';
import { UserS } from './services/user-s';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly userService = inject(UserS);

  // Signaux pour l'UI
  public userFound = this.userService.userFound;
  public searchName = signal<string>('');
  public userList = signal<string[]>([]);

  // CORRECTION : Initialisation complète pour correspondre à ton formulaire HTML
  public newUserForm: User = this.initEmptyUser();

  private initEmptyUser(): User {
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
      // Si on clique sur l'historique, on met à jour le champ de recherche visuellement
      this.searchName.set(term);
      this.userService.getRemoteUser(term);
    }
  }

  public onCreate(): void {
    if (!this.newUserForm.username) {
      alert("Le username est obligatoire !");
      return;
    }

    // On clone l'objet du formulaire et on ajoute un ID unique
    const userToCreate: User = {
      ...this.newUserForm,
      id: Date.now()
    };

    this.userService.createRemoteUser(userToCreate).subscribe({
      next: () => {
        // Mise à jour de l'historique local (Signal)
        this.userList.update(list => {
          // On évite les doublons dans la liste visuelle
          return list.includes(userToCreate.username!) ? list : [...list, userToCreate.username!];
        });

        // Reset complet du formulaire
        this.newUserForm = this.initEmptyUser();
        alert('✅ Utilisateur créé avec succès sur le serveur !');
      },
      error: (err) => {
        console.error("Erreur de création", err);
        alert("Erreur lors de l'envoi au serveur. Vérifiez la console.");
      }
    });
  }
}
