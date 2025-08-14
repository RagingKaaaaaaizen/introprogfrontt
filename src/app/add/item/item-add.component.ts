import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ItemService } from '../../_services/item.service';
import { CategoryService } from '../../_services/category.service';
import { BrandService } from '../../_services/brand.service';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styles: [`
    .form-container {
      padding: 20px 0;
    }

    .page-header {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .header-title i {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin: 0 0 5px 0;
    }

    .page-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .form-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0 !important;
      padding: 20px;
      font-weight: 600;
    }

    .card-body {
      padding: 30px;
    }

    .item-form {
      max-width: 100%;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .form-label i {
      color: #667eea;
      font-size: 0.9rem;
    }

    .form-control {
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 12px 15px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }

    .btn-outline-secondary {
      border: 2px solid #6c757d;
      color: #6c757d;
    }

    .btn-outline-secondary:hover {
      background: #6c757d;
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .form-row {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column;
      }

      .card-body {
        padding: 20px;
      }
    }

    // Search functionality styles
    .search-input-container {
      position: relative;
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }

    .search-result-item {
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.2s ease;
    }

    .search-result-item:hover {
      background-color: #f8f9fa;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }



    .search-result-item i {
      font-size: 14px;
    }
  `]
})
export class ItemAddComponent implements OnInit {
  model: any = {};
  categories: any[] = [];
  brands: any[] = [];
  filteredCategories: any[] = [];
  filteredBrands: any[] = [];
  showCategoryResults = false;
  showBrandResults = false;
  categoryExists = false;
  brandExists = false;
  loading = false;
  submitted = false;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();
  }

  loadCategories() {
    this.categoryService.getAll()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Failed to load categories', err);
          this.alertService.error('Failed to load categories');
        }
      });
  }

  loadBrands() {
    this.brandService.getAll()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.brands = data;
        },
        error: (err) => {
          console.error('Failed to load brands', err);
          this.alertService.error('Failed to load brands');
        }
      });
  }

  // Search and selection methods for categories
  searchCategories(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.model.categoryName = event.target.value;
    
    if (searchTerm.length === 0) {
      this.filteredCategories = [];
      this.showCategoryResults = false;
      this.categoryExists = false;
      return;
    }

    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm)
    );
    
    this.categoryExists = this.categories.some(category => 
      category.name.toLowerCase() === searchTerm
    );
    
    this.showCategoryResults = true;
  }

  selectCategory(category: any) {
    this.model.categoryId = category.id;
    this.model.categoryName = category.name;
    this.showCategoryResults = false;
    this.categoryExists = true;
  }

  onCategoryBlur() {
    setTimeout(() => {
      this.showCategoryResults = false;
    }, 200);
  }

  // Search and selection methods for brands
  searchBrands(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.model.brandName = event.target.value;
    
    if (searchTerm.length === 0) {
      this.filteredBrands = [];
      this.showBrandResults = false;
      this.brandExists = false;
      return;
    }

    this.filteredBrands = this.brands.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm)
    );
    
    this.brandExists = this.brands.some(brand => 
      brand.name.toLowerCase() === searchTerm
    );
    
    this.showBrandResults = true;
  }

  selectBrand(brand: any) {
    this.model.brandId = brand.id;
    this.model.brandName = brand.name;
    this.showBrandResults = false;
    this.brandExists = true;
  }

  onBrandBlur() {
    setTimeout(() => {
      this.showBrandResults = false;
    }, 200);
  }

  async saveItem() {
    this.submitted = true;
    this.loading = true;

    console.log('Submitting payload:', this.model);

    if (!this.model.name || (!this.model.categoryId && !this.model.categoryName) || (!this.model.brandId && !this.model.brandName)) {
      this.alertService.error('Item name, category, and brand are required');
      this.loading = false;
      return;
    }

    try {
      // Handle category creation if needed
      if (!this.model.categoryId && this.model.categoryName) {
        const newCategory = await this.createCategory(this.model.categoryName);
        this.model.categoryId = newCategory.id;
      }

      // Handle brand creation if needed
      if (!this.model.brandId && this.model.brandName) {
        const newBrand = await this.createBrand(this.model.brandName);
        this.model.brandId = newBrand.id;
      }

      // Now save the item
      this.itemService.create(this.model)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Item saved successfully!');
            this.router.navigate(['/add/item']);
          },
          error: (err) => {
            console.error(err);
            this.alertService.error('Failed to save item');
            this.loading = false;
          }
        });

    } catch (error) {
      console.error('Error creating category or brand:', error);
      this.alertService.error('Failed to create category or brand');
      this.loading = false;
    }
  }

  private createCategory(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.categoryService.create({ name })
        .pipe(first())
        .subscribe({
          next: (category) => {
            console.log('New category created:', category);
            this.categories.push(category);
            resolve(category);
          },
          error: (err) => {
            console.error('Failed to create category:', err);
            reject(err);
          }
        });
    });
  }

  private createBrand(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.brandService.create({ name })
        .pipe(first())
        .subscribe({
          next: (brand) => {
            console.log('New brand created:', brand);
            this.brands.push(brand);
            resolve(brand);
          },
          error: (err) => {
            console.error('Failed to create brand:', err);
            reject(err);
          }
        });
    });
  }
}
