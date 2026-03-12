import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProductsService} from '../../services/products-service';
import {ProductDTO} from '../../api/products';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product implements OnInit {
// 1. On explicite le type du service
  private readonly productsService: ProductsService = inject(ProductsService);

  // 2. On récupère la RÉFÉRENCE du signal (le type est WritableSignal)
  public readonly products: WritableSignal<ProductDTO[]> = this.productsService.products;
  public readonly isLoading: WritableSignal<boolean> = this.productsService.isLoading;

  ngOnInit(): void {
    console.log("🚀 Initialisation du composant : Appel au Backend...");
    this.productsService.loadProducts(); // 👈 On déclenche enfin l'appel AP
  }
  // 3. On type le signal local du formulaire
  // Initialisation avec des valeurs par défaut pour éviter le "undefined"
  public newProductForm: WritableSignal<ProductDTO> = signal<ProductDTO>({
    label: '',
    price: 0,
    description: ''
  });



// ... dans ta classe Product

  // Méthode de mise à jour propre (Type-Safe)
  public updateForm(field: keyof ProductDTO, value: any): void {
    this.newProductForm.update(current => ({
      ...current,
      [field]: value
    }));
  }

  public onCreateProduct(): void {
    const formValue: ProductDTO = this.newProductForm();
    // On vérifie que le label n'est pas vide (String.trim() comme en Java)
    if (!formValue.label?.trim() || formValue.price <= 0) return;
    this.productsService.addProduct(formValue);
    // Reset complet après envoi
    this.newProductForm.set({ label: '', price: 0, description: '' });
  }
}
