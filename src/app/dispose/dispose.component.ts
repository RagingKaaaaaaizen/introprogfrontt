import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DisposeService } from '../_services/dispose.service';
import { Dispose } from '../_models';
import { ItemService } from '../_services/item.service';
import { StorageLocationService } from '../_services/storage-location.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-dispose',
  templateUrl: './dispose.component.html'
})
export class DisposeComponent implements OnInit {
  form: FormGroup;
  items: any[] = [];
  locations: any[] = [];
  availableStock: number = 0;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private disposeService: DisposeService,
    private itemService: ItemService,
    private locationService: StorageLocationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    
    // Listen for stock data changes from other components
    window.addEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }

  initForm() {
    this.form = this.formBuilder.group({
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      disposalValue: ['', [Validators.required, Validators.min(0.01)]],
      locationId: ['', Validators.required],
      reason: ['']
    });
  }

  loadData() {
    // Load items
    this.itemService.getAll().subscribe({
      next: (items) => {
        this.items = items;
        console.log('Items loaded:', items.length);
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.alertService.error('Error loading items');
      }
    });

    // Load locations
    this.locationService.getAll().subscribe({
      next: (locations) => {
        this.locations = locations;
        console.log('Locations loaded:', locations.length);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.alertService.error('Error loading locations');
      }
    });

    // Check for pre-selected item
    this.route.queryParams.subscribe(params => {
      if (params['itemId']) {
        const itemId = parseInt(params['itemId']);
        console.log('Pre-selected item:', itemId);
        this.form.patchValue({ itemId: itemId });
        this.checkAvailableStock(itemId);
      }
    });

    // Listen for item changes
    this.form.get('itemId')?.valueChanges.subscribe(itemId => {
      if (itemId) {
        this.checkAvailableStock(itemId);
      } else {
        this.availableStock = 0;
      }
    });
  }

  checkAvailableStock(itemId: number) {
    console.log('Checking available stock for item:', itemId);
    
    // Use dispose service to get actual available stock
    this.disposeService.validateDisposal(itemId, 0).subscribe({
      next: (result) => {
        console.log('Available stock result:', result);
        if (result && result.valid !== undefined) {
          this.availableStock = result.availableStock || 0;
          console.log('Available stock set to:', this.availableStock);
          
          // Show detailed stock information
          if (result.totalStock !== undefined && result.usedInPCComponents !== undefined) {
            console.log('Stock breakdown:', {
              totalStock: result.totalStock,
              usedInPCComponents: result.usedInPCComponents,
              availableStock: result.availableStock
            });
            
            // Show alert with detailed information
            if (result.usedInPCComponents > 0) {
              this.alertService.info(`Stock Info: ${result.totalStock} total - ${result.usedInPCComponents} used in PC components = ${result.availableStock} available for disposal`);
            }
          }
          
          // Update quantity field with available stock if it's greater than 0
          if (this.availableStock > 0) {
            this.form.patchValue({ quantity: this.availableStock });
          } else {
            this.form.patchValue({ quantity: '' });
          }
        } else {
          console.log('Invalid result format:', result);
          this.availableStock = 0;
          this.form.patchValue({ quantity: '' });
        }
      },
      error: (error) => {
        console.error('Error checking available stock:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.availableStock = 0;
        this.form.patchValue({ quantity: '' });
        this.alertService.error('Error loading available stock: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    console.log('Form submitted, checking validity...');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    console.log('Form errors:', this.form.errors);

    if (this.form.invalid) {
      console.log('Form is invalid, returning');
      console.log('Form control errors:');
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.errors) {
          console.log(`  ${key}:`, control.errors);
        }
      });
      return;
    }

    const formData = this.form.value;
    console.log('Submitting dispose form:', formData);

    this.loading = true;

    // Format data properly - don't add defaults for empty values
    const disposeData = {
      itemId: parseInt(formData.itemId),
      quantity: parseInt(formData.quantity),
      disposalValue: formData.disposalValue ? parseFloat(formData.disposalValue) : 0,
      locationId: parseInt(formData.locationId),
      reason: formData.reason || '',
      disposalDate: new Date()
    };

    console.log('Formatted dispose data:', disposeData);

    this.disposeService.create(disposeData).subscribe({
      next: (result) => {
        console.log('Dispose successful:', result);
        this.loading = false;
        this.alertService.success('Items disposed successfully');
        
        // Notify stock list component to refresh its data
        this.notifyStockListRefresh();
        
        console.log('Navigating to dispose list...');
        this.router.navigate(['/dispose']); // Navigate to dispose list
      },
      error: (error) => {
        console.error('Dispose error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
          url: error.url
        });
        this.loading = false;
        
        // Simple error message
        let errorMessage = 'Error disposing items';
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        } else if (error.status === 400) {
          errorMessage += ': Invalid data provided';
        } else if (error.status === 401) {
          errorMessage += ': Unauthorized - please login again';
        } else if (error.status === 403) {
          errorMessage += ': Access denied';
        } else if (error.status === 404) {
          errorMessage += ': Item or location not found';
        } else if (error.status === 500) {
          errorMessage += ': Server error - please try again';
        }
        
        this.error = errorMessage;
        this.alertService.error(this.error);
      }
    });
  }

  disposeAll() {
    if (!this.form.value.itemId) {
      this.alertService.error('Please select an item first');
      return;
    }

    if (this.availableStock <= 0) {
      this.alertService.error('No stock available to dispose');
      return;
    }

    if (!confirm(`Are you sure you want to dispose ALL ${this.availableStock} available items?`)) {
      return;
    }

    this.form.patchValue({ quantity: this.availableStock });
    this.onSubmit();
  }

  testNavigation() {
    console.log('Testing navigation to dispose list...');
    this.router.navigate(['/dispose']).then(() => {
      console.log('Navigation successful');
    }).catch(error => {
      console.error('Navigation failed:', error);
    });
  }

  // Method to notify stock list component to refresh its data
  private notifyStockListRefresh() {
    // Dispatch a custom event that stock list component can listen to
    const event = new CustomEvent('stockDataChanged', {
      detail: {
        timestamp: new Date().getTime(),
        message: 'Items disposed - stock data updated'
      }
    });
    window.dispatchEvent(event);
    console.log('Stock data change event dispatched from dispose component');
  }

  // Handle stock data changes from other components
  private handleStockDataChange(event: CustomEvent) {
    console.log('Stock data change detected in dispose component:', event.detail);
    
    // Re-check available stock for the currently selected item
    const currentItemId = this.form.get('itemId')?.value;
    if (currentItemId) {
      console.log('Re-checking available stock for item:', currentItemId);
      this.checkAvailableStock(currentItemId);
    }
    
    // Show a brief notification
    this.alertService.info('Stock data updated - available quantities refreshed');
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }
} 