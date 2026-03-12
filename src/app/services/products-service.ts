import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {ProductDTO, ProductService} from '../api/products';
import {User} from '../api/generated';
import {finalize} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // 1. Injection du service généré
  private  productApi :ProductService = inject(ProductService);

  // 2. État réactif (Signals)
  products : WritableSignal<ProductDTO[]>  = signal<ProductDTO []>([]);
  isLoading :WritableSignal<boolean>=signal<boolean>(false);

  // 3. Action : Charger les produits
  /**
   * Charge la liste des produits depuis le Backend (GET)
   */
  public loadProducts(): void {
    this.isLoading.set(true);

    // L'Observable retourné par l'API est automatiquement typé Observable<ProductDTO[]>
    this.productApi.getAll().subscribe({
      next: (data: any) => {
        console.log('Données brutes reçues du Backend:', data);
        // On s'assure que 'data' est bien un Array
        if (Array.isArray(data)) {
          this.products.set(data);
        } else {
          console.error('Le Backend n’a pas renvoyé un tableau !', data);
        }
        this.isLoading.set(false);
      },
      error: (err: any): void => {
        console.error('Erreur de récupération:', err);
        this.isLoading.set(false);
      }
    });
  }
  // 4. Action : Créer un produit
  addProduct(newProduct: ProductDTO){
    this.productApi.create(newProduct).subscribe({
       next: () => this.loadProducts(), // On rafraîchit la liste après création
      error: (err) => console.error('Erreur de création', err)
      });
  }

}
