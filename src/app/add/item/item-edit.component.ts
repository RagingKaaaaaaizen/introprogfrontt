import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ItemService } from '../../_services/item.service';
import { CategoryService } from '../../_services/category.service';
import { BrandService } from '../../_services/brand.service';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }

    .form-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .card {
      border: none;
      border-radius: 12px;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
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
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 0.95rem;
    }

    .form-label i {
      margin-right: 8px;
      color: #667eea;
      width: 16px;
    }

    .form-control {
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background-color: #fff;
    }

    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      outline: none;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }

    .form-control:disabled,
    .form-control[readonly] {
      background-color: #f8f9fa;
      opacity: 0.8;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
    }

    .form-row .form-group {
      flex: 1;
      margin-bottom: 0;
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 5px;
      font-size: 0.875rem;
      color: #dc3545;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      color: white;
    }

    .btn-primary:disabled {
      background: #6c757d;
      opacity: 0.6;
      transform: none;
      box-shadow: none;
    }

    .btn-outline-secondary {
      border-color: #6c757d;
      color: #6c757d;
      background: transparent;
    }

    .btn-outline-secondary:hover {
      background: #6c757d;
      color: white;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
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
        gap: 0;
      }

      .form-actions {
        flex-direction: column;
        gap: 10px;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 2rem;
      }

      .card-body {
        padding: 20px;
      }
    }

    /* Search functionality styles */
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
export class ItemEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isViewMode: boolean;
  loading = false;
  submitted = false;
  categories: any[] = [];
  brands: any[] = [];
  filteredCategories: any[] = [];
  filteredBrands: any[] = [];
  showCategoryResults = false;
  showBrandResults = false;
  categoryExists = false;
  brandExists = false;
  title: string;
  
  // Form controls for category and brand names
  categoryNameControl = this.formBuilder.control('');
  brandNameControl = this.formBuilder.control('');

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isViewMode = this.route.snapshot.data['viewMode'] || false;
    this.title = this.isViewMode ? 'View Item' : (this.id ? 'Edit Item' : 'Add Item');

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: [''],
      brandId: [''],
      description: ['']
    });

    this.loadCategories();
    this.loadBrands();

    if (this.id) {
      this.loadItem();
    }
  }

  loadItem() {
    this.loading = true;
    this.itemService.getById(this.id)
      .pipe(first())
      .subscribe({
        next: (item) => {
          this.form.patchValue({
            name: item.name,
            categoryId: item.categoryId,
            brandId: item.brandId,
            description: item.description
          });
          
          // Set category and brand names for display
          if (item.category) {
            this.categoryNameControl.setValue(item.category.name);
          }
          if (item.brand) {
            this.brandNameControl.setValue(item.brand.name);
          }
          
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  loadCategories() {
    this.categoryService.getAll()
      .pipe(first())
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  loadBrands() {
    this.brandService.getAll()
      .pipe(first())
      .subscribe({
        next: (brands) => {
          this.brands = brands;
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  // Search and selection methods for categories
  searchCategories(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.categoryNameControl.setValue(event.target.value);
    
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
    this.form.patchValue({ categoryId: category.id });
    this.categoryNameControl.setValue(category.name);
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
    this.brandNameControl.setValue(event.target.value);
    
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
    this.form.patchValue({ brandId: brand.id });
    this.brandNameControl.setValue(brand.name);
    this.showBrandResults = false;
    this.brandExists = true;
  }

  onBrandBlur() {
    setTimeout(() => {
      this.showBrandResults = false;
    }, 200);
  }

  async save() {
    this.submitted = true;

    // Check if we have the required fields (either IDs or names)
    if (!this.form.get('name')?.value || 
        (!this.form.get('categoryId')?.value && !this.categoryNameControl.value) ||
        (!this.form.get('brandId')?.value && !this.brandNameControl.value)) {
      this.alertService.error('Item name, category, and brand are required');
      return;
    }

    this.loading = true;

    try {
      let categoryId = this.form.get('categoryId')?.value;
      let brandId = this.form.get('brandId')?.value;

      // Auto-create category if needed
      if (!categoryId && this.categoryNameControl.value) {
        const newCategory = await this.createCategory(this.categoryNameControl.value);
        categoryId = newCategory.id;
        this.alertService.success(`Category "${newCategory.name}" created automatically`);
      }

      // Auto-create brand if needed
      if (!brandId && this.brandNameControl.value) {
        const newBrand = await this.createBrand(this.brandNameControl.value);
        brandId = newBrand.id;
        this.alertService.success(`Brand "${newBrand.name}" created automatically`);
      }

      const itemData = {
        name: this.form.get('name')?.value,
        categoryId: categoryId,
        brandId: brandId,
        description: this.form.get('description')?.value
      };

      if (this.id) {
        // Update existing item
        this.itemService.update(this.id, itemData)
          .pipe(first())
          .subscribe({
            next: () => {
              this.alertService.success('Item updated successfully');
              this.router.navigate(['/add/item']);
            },
            error: (error) => {
              console.error('Error updating item:', error);
              this.alertService.error('Failed to update item');
              this.loading = false;
            }
          });
      } else {
        // Create new item
        this.itemService.create(itemData)
          .pipe(first())
          .subscribe({
            next: () => {
              this.alertService.success('Item created successfully');
              this.router.navigate(['/add/item']);
            },
            error: (error) => {
              console.error('Error creating item:', error);
              this.alertService.error('Failed to create item');
              this.loading = false;
            }
          });
      }
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
