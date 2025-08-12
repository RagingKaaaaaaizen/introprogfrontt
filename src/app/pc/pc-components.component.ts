import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { PCService, PCComponentService, StockService, ItemService, CategoryService, BrandService, AlertService, AccountService } from '@app/_services';
import { PCComponent, Role } from '@app/_models';

@Component({
  selector: 'app-pc-components',
  templateUrl: './pc-components.component.html',
  styleUrls: ['./pc-components.component.css']
})
export class PCComponentsComponent implements OnInit {
  Role = Role;
  pc: any = null;
  components: PCComponent[] = [];
  items: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  allStocks: any[] = [];
  
  // Add component form properties
  showAddForm = false;
  newComponent: Partial<PCComponent> = {
    itemId: null,
    stockId: null, // Add stockId to track which stock entry is being used
    quantity: 1,
    price: null,
    totalPrice: null,
    status: 'Working' as any,
    remarks: ''
  };
  availableItems: any[] = [];
  existingPCComponents: PCComponent[] = [];
  categoryError = '';
  submitted = false;
  loading = false;

  // Computed property for available stocks count
  get availableStocksCount(): number {
    const count = this.allStocks.filter(stock => stock.quantity > 0).length;
    console.log('availableStocksCount calculated:', count, 'from', this.allStocks.length, 'total stocks');
    return count;
  }

  // Method to get stock alert class
  getStockAlertClass(itemId: number): string {
    if (!itemId) return '';
    
    const stockStatus = this.getStockStatus(itemId);
    console.log(`getStockAlertClass for item ${itemId}:`, stockStatus);
    
    if (stockStatus.availableQty > 0) {
      return 'alert-success';
    } else if (stockStatus.hasStock && stockStatus.hasZeroStock) {
      return 'alert-warning';
    } else {
      return 'alert-danger';
    }
  }

  // Debug method to get stock details for an item
  getStockDebugInfo(itemId: number): any {
    if (!itemId || this.allStocks.length === 0) {
      return { message: 'No stock data available' };
    }
    
    // Convert itemId to number to ensure type matching
    const numericItemId = Number(itemId);
    
    console.log('getStockDebugInfo - itemId:', itemId, 'type:', typeof itemId);
    console.log('getStockDebugInfo - numericItemId:', numericItemId, 'type:', typeof numericItemId);
    console.log('getStockDebugInfo - allStocks itemIds:', this.allStocks.map(s => ({ id: s.id, itemId: s.itemId, itemIdType: typeof s.itemId })));
    
    const stockEntries = this.allStocks.filter(stock => {
      const stockItemId = Number(stock.itemId);
      const matches = stockItemId === numericItemId;
      console.log(`Stock ${stock.id}: itemId=${stock.itemId} (${typeof stock.itemId}) vs selected=${numericItemId} (${typeof numericItemId}) - matches: ${matches}`);
      return matches;
    });
    
    const availableStocks = stockEntries.filter(stock => stock.quantity > 0);
    
    const result = {
      itemId,
      numericItemId,
      totalStocks: this.allStocks.length,
      matchingStocks: stockEntries.length,
      availableStocks: availableStocks.length,
      stockEntries: stockEntries.map(s => ({
        id: s.id,
        itemId: s.itemId,
        quantity: s.quantity,
        price: s.price,
        locationId: s.locationId,
        locationName: s.location?.name || 'No location'
      }))
    };
    
    console.log('getStockDebugInfo result:', result);
    
    return result;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pcService: PCService,
    private pcComponentService: PCComponentService,
    private stockService: StockService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private alertService: AlertService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    const pcId = this.route.snapshot.params['id'];
    this.loadPC(pcId);
    this.loadData();
    
    // Listen for stock data changes from other components
    window.addEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }

  loadData() {
    this.loadItems();
    this.loadCategories();
    this.loadBrands();
    this.loadStocksForFiltering();
  }

  loadStocksForFiltering() {
    console.log('Loading stocks from API...');
    this.stockService.getAll()
      .pipe(first())
      .subscribe({
        next: (stocks) => {
          this.allStocks = stocks;
          console.log('Loaded stocks for filtering:', stocks.length);
          
          // Debug stock data structure
          if (stocks.length > 0) {
            const sampleStock = stocks[0];
            console.log('Sample stock structure:', {
              id: sampleStock.id,
              itemId: sampleStock.itemId,
              locationId: sampleStock.locationId,
              quantity: sampleStock.quantity,
              price: sampleStock.price,
              totalPrice: sampleStock.totalPrice,
              remarks: sampleStock.remarks,
              createdAt: sampleStock.createdAt,
              item: sampleStock.item,
              location: sampleStock.location
            });
            
            // Log all stock entries for debugging
            console.log('All stock entries:', stocks.map(s => ({
              id: s.id,
              itemId: s.itemId,
              itemName: s.item?.name || 'No item',
              locationId: s.locationId,
              locationName: s.location?.name || 'No location',
              quantity: s.quantity,
              price: s.price
            })));
          } else {
            console.log('No stock entries found in database');
          }
          
          // Filter available items if items are already loaded
          if (this.items.length > 0) {
            this.filterAvailableItems();
          } else {
            console.log('Items not loaded yet, stocks will be used when items are loaded');
          }
        },
        error: error => {
          this.alertService.error('Error loading stocks: ' + error);
          console.error('Error loading stocks:', error);
          console.error('Error details:', error);
        }
      });
  }

  filterAvailableItems() {
    if (this.allStocks.length === 0) {
      console.log('No stocks loaded yet, cannot filter available items');
      return;
    }

    if (this.items.length === 0) {
      console.log('No items loaded yet, cannot filter available items');
      return;
    }

    console.log('Filtering available items across all locations');
    console.log('Total stocks loaded:', this.allStocks.length);
    console.log('Total items loaded:', this.items.length);

    // NOTE: Stock entries use StorageLocation, but PC uses RoomLocation
    // For now, we'll show all available stock regardless of location
    // This allows users to add components from any available stock
    
    // Get all stock entries with positive quantities
    const availableStocks = this.allStocks.filter(stock => stock.quantity > 0);

    console.log('Available stocks (all locations):', availableStocks.length);
    console.log('Available stocks details:', availableStocks.map(s => ({
      id: s.id,
      itemId: s.itemId,
      locationId: s.locationId,
      quantity: s.quantity,
      price: s.price,
      item: s.item ? s.item.name : 'No item data'
    })));

    // Group by item and calculate available quantities
    const itemAvailability = new Map();
    availableStocks.forEach(stock => {
      const itemId = Number(stock.itemId); // Ensure numeric type
      if (!itemAvailability.has(itemId)) {
        itemAvailability.set(itemId, 0);
      }
      itemAvailability.set(itemId, itemAvailability.get(itemId) + stock.quantity);
    });

    console.log('Item availability map:', itemAvailability);

    // Filter items that have stock available
    this.availableItems = this.items.filter(item => {
      const availableQty = itemAvailability.get(item.id) || 0;
      const hasStock = availableQty > 0;
      console.log(`Item ${item.name} (ID: ${item.id}): ${availableQty} available`);
      return hasStock;
    });

    console.log('Available items for PC component:', this.availableItems.length);
    console.log('Available items:', this.availableItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category ? item.category.name : 'No category'
    })));

    // Force change detection to update the template
    setTimeout(() => {
      console.log('Forcing change detection after filtering items');
    }, 0);
  }

  loadExistingPCComponents() {
    if (!this.pc) return;

    // Get ALL PC components globally to calculate accurate available stock
    this.pcComponentService.getAll()
      .pipe(first())
      .subscribe({
        next: (components) => {
          this.existingPCComponents = components;
          console.log('Global PC components loaded:', this.existingPCComponents.length);
          
          // Also load current PC components for display
          this.loadCurrentPCComponents();
        },
        error: error => {
          console.error('Error loading global PC components:', error);
          this.existingPCComponents = [];
        }
      });
  }

  loadCurrentPCComponents() {
    if (!this.pc) return;

    // Get existing components for this PC from the PC Components table
    this.pcComponentService.getByPCId(this.pc.id)
      .pipe(first())
      .subscribe({
        next: (components) => {
          this.components = components;
          console.log('Current PC components:', this.components);
        },
        error: error => {
          console.error('Error loading current PC components:', error);
          this.components = [];
        }
      });
  }

  onItemChange() {
    console.log('Item changed to:', this.newComponent.itemId);
    
    if (this.newComponent.itemId) {
      // Reset price, total price, and stock ID when item changes
      this.newComponent.price = null;
      this.newComponent.totalPrice = null;
      this.newComponent.stockId = null;
      
      // Validate category first
      this.validateCategory();
      
      // Load price from stock immediately when item is selected
      console.log('Loading price immediately for item:', this.newComponent.itemId);
      this.loadPriceFromStock();
    } else {
      // Reset price, total price, and stock ID when no item is selected
      this.newComponent.price = null;
      this.newComponent.totalPrice = null;
      this.newComponent.stockId = null;
    }
  }

  onPriceInput() {
    // Recalculate total price when price changes
    this.calculateTotalPrice();
  }

  onQuantityChange() {
    console.log('onQuantityChange called - current quantity:', this.newComponent.quantity);
    
    // Don't validate if quantity is empty or null
    if (!this.newComponent.quantity || this.newComponent.quantity === null) {
      console.log('Quantity is empty, skipping validation');
      return;
    }
    
    // Convert to number and validate
    const quantity = Number(this.newComponent.quantity);
    
    // Only validate if we have a valid item selected
    if (this.newComponent.itemId && quantity > 0) {
      // Check if quantity exceeds available stock
      const availableQuantity = this.getAvailableQuantity(this.newComponent.itemId);
      console.log('Available quantity:', availableQuantity, 'Requested quantity:', quantity);
      
      if (availableQuantity === 0) {
        console.log('No stock available for this item at this location');
        this.alertService.error('No stock available for this item at this location.');
        this.newComponent.quantity = 1; // Reset to 1 instead of empty
        return;
      }
      
      if (quantity > availableQuantity) {
        this.alertService.error(`Only ${availableQuantity} units are available in stock.`);
        this.newComponent.quantity = availableQuantity; // Reset to max available
        console.log('Quantity reset to:', this.newComponent.quantity);
        this.calculateTotalPrice(); // Recalculate after reset
        return;
      }
      
      // Recalculate total price when quantity changes
      this.calculateTotalPrice();
    }
  }

  getAvailableQuantity(itemId: number): number {
    if (this.allStocks.length === 0) {
      console.log('No stocks loaded yet for getAvailableQuantity');
      return 0;
    }
    
    // Convert itemId to number to ensure type matching
    const numericItemId = Number(itemId);
    
    console.log('Getting available quantity for item:', itemId, 'numeric:', numericItemId, 'across all locations');
    console.log('Total stocks loaded:', this.allStocks.length);
    
    // Calculate total stock for this item (sum of all positive quantities)
    const itemStocks = this.allStocks.filter(stock => {
      const stockItemId = Number(stock.itemId);
      return stockItemId === numericItemId;
    });
    
    console.log('All stock entries for item', itemId, ':', itemStocks.length);
    
    // Calculate total stock (sum of all positive quantities)
    let totalStock = 0;
    itemStocks.forEach(stock => {
      if (stock.quantity > 0) {
        totalStock += stock.quantity;
      }
    });
    
    // Calculate how much is already used in PC components globally
    // We need to get this from the backend to get accurate global usage
    const usedInPCComponents = this.getGlobalPCComponentUsage(numericItemId);
    
    // Available quantity = total stock - used in PC components globally
    const availableQuantity = Math.max(0, totalStock - usedInPCComponents);
    
    console.log('Stock calculation for item', itemId, ':', {
      totalStock,
      usedInPCComponents,
      availableQuantity,
      stockEntries: itemStocks.map(s => ({
        id: s.id,
        itemId: s.itemId,
        quantity: s.quantity,
        type: s.quantity > 0 ? 'available' : 'empty'
      }))
    });
    
    return availableQuantity;
  }

  // Get global PC component usage for an item (from all PCs, not just current PC)
  private getGlobalPCComponentUsage(itemId: number): number {
    // For now, we'll use the existing components data
    // In a more robust implementation, this would fetch from backend
    const globalUsage = this.existingPCComponents
      .filter(component => component.itemId === itemId)
      .reduce((total, component) => total + component.quantity, 0);
    
    console.log(`Global PC component usage for item ${itemId}: ${globalUsage}`);
    return globalUsage;
  }

  // Add a method to check if stock exists but is zero
  hasStockButZero(itemId: number): boolean {
    if (this.allStocks.length === 0) {
      return false;
    }
    
    const stockEntries = this.allStocks.filter(stock => 
      stock.itemId === itemId
    );
    
    return stockEntries.length > 0 && stockEntries.every(stock => stock.quantity <= 0);
  }

  // Add a method to get stock status for better error messages
  getStockStatus(itemId: number): { hasStock: boolean; hasZeroStock: boolean; availableQty: number; totalEntries: number } {
    if (this.allStocks.length === 0) {
      console.log('No stocks loaded yet for getStockStatus');
      return { hasStock: false, hasZeroStock: false, availableQty: 0, totalEntries: 0 };
    }
    
    // Convert itemId to number to ensure type matching
    const numericItemId = Number(itemId);
    
    // Get all stock entries for this item
    const stockEntries = this.allStocks.filter(stock => {
      const stockItemId = Number(stock.itemId);
      return stockItemId === numericItemId;
    });
    
    // Calculate total stock (sum of all positive quantities)
    let totalStock = 0;
    stockEntries.forEach(stock => {
      if (stock.quantity > 0) {
        totalStock += stock.quantity;
      }
    });
    
    // Calculate how much is already used in PC components globally
    const usedInPCComponents = this.getGlobalPCComponentUsage(numericItemId);
    
    // Available quantity = total stock - used in PC components
    const availableQty = Math.max(0, totalStock - usedInPCComponents);
    
    const hasZeroStock = stockEntries.length > 0 && totalStock <= 0;
    
    console.log(`getStockStatus for item ${itemId} (numeric: ${numericItemId}):`, {
      totalStocks: this.allStocks.length,
      matchingStocks: stockEntries.length,
      totalStock,
      usedInPCComponents,
      availableQty,
      stockEntries: stockEntries.map(s => ({
        id: s.id,
        itemId: s.itemId,
        quantity: s.quantity,
        type: s.quantity > 0 ? 'available' : 'empty'
      }))
    });
    
    const result = {
      hasStock: stockEntries.length > 0,
      hasZeroStock,
      availableQty,
      totalEntries: stockEntries.length
    };
    
    console.log(`getStockStatus result for item ${itemId}:`, result);
    
    return result;
  }

  loadPriceFromStock() {
    if (!this.newComponent.itemId) {
      console.log('No item selected, skipping price loading');
      return;
    }

    if (this.allStocks.length === 0) {
      console.log('No stocks loaded yet, cannot load price');
      return;
    }

    // Convert itemId to number to ensure type matching
    const numericItemId = Number(this.newComponent.itemId);

    console.log('Loading price for item:', this.newComponent.itemId, 'numeric:', numericItemId);
    console.log('All stocks available:', this.allStocks.length);

    // NOTE: Stock entries use StorageLocation, but PC uses RoomLocation
    // For now, we'll get all stock entries for this item regardless of location
    // This allows users to add components from any available stock
    const stockEntries = this.allStocks.filter(stock => {
      const stockItemId = Number(stock.itemId);
      return stockItemId === numericItemId && stock.quantity > 0;
    });

    console.log('Found stock entries for price loading:', stockEntries.length);
    console.log('Stock entries details:', stockEntries.map(s => ({
      id: s.id,
      itemId: s.itemId,
      locationId: s.locationId,
      quantity: s.quantity,
      price: s.price,
      remarks: s.remarks,
      createdAt: s.createdAt
    })));

    if (stockEntries.length > 0) {
      // Sort by creation date (most recent first)
      stockEntries.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });

      // Use the most recent stock entry's price and store its ID
      const mostRecentStock = stockEntries[0];
      this.newComponent.price = mostRecentStock.price;
      this.newComponent.stockId = mostRecentStock.id; // Store the stock ID
      
      console.log('Price auto-filled from stock entry:', {
        stockId: mostRecentStock.id,
        stockQuantity: mostRecentStock.quantity,
        stockPrice: mostRecentStock.price,
        priceUsed: mostRecentStock.price,
        itemId: this.newComponent.itemId,
        locationId: mostRecentStock.locationId,
        createdAt: mostRecentStock.createdAt
      });
      
      // Calculate total price if quantity is set (should be 1 by default)
      if (this.newComponent.quantity && this.newComponent.quantity > 0) {
        this.calculateTotalPrice();
      } else {
        // Ensure quantity is set to 1 if not already set
        this.newComponent.quantity = 1;
        this.calculateTotalPrice();
      }
    } else {
      console.log('No stock entries found for price loading');
      console.log('Available stocks for this item:', this.allStocks.filter(stock => {
        const stockItemId = Number(stock.itemId);
        return stockItemId === numericItemId;
      }));
      this.newComponent.price = null;
      this.newComponent.totalPrice = null;
      this.newComponent.stockId = null;
    }
  }

  // Add method to get stock by ID
  getStockById(stockId: number): any {
    return this.allStocks.find(stock => stock.id === stockId);
  }

  // Add method to get stock data for display
  getStockData(itemId: number, locationId?: number): any[] {
    const numericItemId = Number(itemId);
    
    if (locationId) {
      // If location is specified, filter by both item and location
      return this.allStocks.filter(stock => {
        const stockItemId = Number(stock.itemId);
        return stockItemId === numericItemId && stock.locationId === locationId;
      });
    } else {
      // If no location specified, get all stock entries for this item
      return this.allStocks.filter(stock => {
        const stockItemId = Number(stock.itemId);
        return stockItemId === numericItemId && stock.quantity > 0;
      });
    }
  }

  // Add method to get stock details for display
  getStockDetails(itemId: number, locationId?: number): any {
    const stocks = this.getStockData(itemId, locationId);
    if (stocks.length > 0) {
      // Sort by creation date (most recent first)
      stocks.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      return stocks[0]; // Return most recent stock entry
    }
    return null;
  }

  // Add a method to get stock guidance for users
  getStockGuidance(itemId: number): string {
    const stockStatus = this.getStockStatus(itemId);
    
    if (stockStatus.availableQty > 0) {
      return `Available: ${stockStatus.availableQty} units across all locations`;
    } else if (stockStatus.hasStock && stockStatus.hasZeroStock) {
      return 'Stock exists but quantities are zero. Add stock first.';
    } else if (stockStatus.hasStock) {
      return 'Stock entries exist but no available quantity.';
    } else {
      return 'No stock entries found across all locations.';
    }
  }

  // Add method to get price source information
  getPriceSourceInfo(): string {
    if (!this.newComponent.stockId || !this.newComponent.price) {
      return '';
    }
    
    const stock = this.getStockById(this.newComponent.stockId);
    if (stock) {
      return `Price from stock #${stock.id} (${stock.location?.name || 'Unknown location'}) - php${stock.price}`;
    }
    return 'Price from stock data';
  }

  // Add a method to navigate to add stock
  navigateToAddStock() {
    if (this.newComponent.itemId) {
      // Navigate to add stock page with pre-filled item
      this.router.navigate(['/add/stocks'], {
        queryParams: {
          itemId: this.newComponent.itemId,
          returnUrl: this.router.url
        }
      });
    } else {
      // Navigate to general add stock page
      this.router.navigate(['/add/stocks']);
    }
  }

  validateCategory() {
    if (!this.newComponent.itemId) return;

    const selectedItem = this.items.find(item => item.id === this.newComponent.itemId);
    if (!selectedItem) return;

    const selectedCategoryId = selectedItem.categoryId;
    
    // Check if this category is already used in existing components
    const categoryAlreadyUsed = this.existingPCComponents.some(component => {
      // Check if component has item data directly
      if (component.item && component.item.categoryId) {
        return component.item.categoryId === selectedCategoryId;
      }
      // Fallback to checking items array
      const componentItem = this.items.find(item => item.id === component.itemId);
      return componentItem && componentItem.categoryId === selectedCategoryId;
    });

    if (categoryAlreadyUsed) {
      this.categoryError = `Category "${selectedItem.category?.name || 'Unknown'}" is already used in this PC. Only one item per category is allowed.`;
      this.newComponent.itemId = null; // Reset selection
    } else {
      this.categoryError = '';
    }
  }

  calculateTotalPrice() {
    const price = this.newComponent.price;
    const qty = this.newComponent.quantity;
    
    console.log('Calculating total price:', { price, qty });
    
    // Ensure both values are numbers and valid
    const numPrice = Number(price);
    const numQty = Number(qty);
    
    if (numPrice > 0 && numQty > 0) {
      this.newComponent.totalPrice = numPrice * numQty;
      console.log('Total price calculated:', this.newComponent.totalPrice);
    } else {
      this.newComponent.totalPrice = null;
      console.log('Invalid price or quantity, total price set to null');
    }
  }

  loadPC(pcId: number) {
    this.pcService.getById(pcId)
      .pipe(first())
      .subscribe({
        next: (pc) => {
          this.pc = pc;
          console.log('PC loaded:', pc);
          console.log('PC location ID:', pc.roomLocationId);
          
          // Load components and other data after PC is loaded
          this.loadComponents(pcId);
          this.loadExistingPCComponents();
          
          // Ensure stocks are loaded before filtering available items
          if (this.allStocks.length > 0) {
            this.filterAvailableItems();
          } else {
            // If stocks not loaded yet, wait for them
            this.loadStocksForFiltering();
          }
        },
        error: error => {
          this.alertService.error('Error loading PC: ' + error);
          console.error('Error loading PC:', error);
        }
      });
  }

  loadComponents(pcId: number) {
    // Use the new method that loads current PC components
    this.loadCurrentPCComponents();
  }

  loadItems() {
    this.itemService.getAll()
      .pipe(first())
      .subscribe({
        next: (items) => {
          this.items = items;
          // Filter available items if stocks are already loaded
          if (this.allStocks.length > 0) {
            this.filterAvailableItems();
          }
        },
        error: error => {
          this.alertService.error('Error loading items: ' + error);
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
          this.alertService.error('Error loading categories: ' + error);
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
          this.alertService.error('Error loading brands: ' + error);
        }
      });
  }

  refreshData() {
    this.loadExistingPCComponents(); // This will also load current PC components
    this.alertService.success('Data refreshed successfully');
  }

  getItemName(itemId: number): string {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  }

  getItemNameFromComponent(component: any): string {
    if (component.item) {
      return component.item.name;
    }
    return this.getItemName(component.itemId);
  }

  getCategoryName(component: any): string {
    // Check if component has item data directly
    if (component.item && component.item.category) {
      return component.item.category.name;
    }
    
    const item = this.items.find(i => i.id === component.itemId);
    if (!item) return 'Unknown';
    
    const category = this.categories.find(c => c.id === item.categoryId);
    return category ? category.name : 'Unknown Category';
  }

  getBrandName(component: any): string {
    // Check if component has item data directly
    if (component.item && component.item.brand) {
      return component.item.brand.name;
    }
    
    const item = this.items.find(i => i.id === component.itemId);
    if (!item) return 'Unknown';
    
    const brand = this.brands.find(b => b.id === item.brandId);
    return brand ? brand.name : 'Unknown Brand';
  }

  getTotalValue(): number {
    return this.components.reduce((total, component) => {
      return total + (component.price * component.quantity);
    }, 0);
  }

  getUniqueCategories(): number {
    const categoryIds = this.components.map(component => {
      // Check if component has item data directly
      if (component.item && component.item.categoryId) {
        return component.item.categoryId;
      }
      // Fallback to checking items array
      const item = this.items.find(i => i.id === component.itemId);
      return item ? item.categoryId : null;
    }).filter(id => id !== null);
    
    return [...new Set(categoryIds)].length;
  }

  getTotalQuantity(): number {
    return this.components.reduce((total, component) => {
      return total + component.quantity;
    }, 0);
  }

  addComponent() {
    this.showAddForm = true;
    this.resetNewComponent();
    this.loadExistingPCComponents();
    
    // Refresh stock data to ensure we have the latest information
    this.loadStocksForFiltering();
    
    // Ensure quantity is properly set to 1
    setTimeout(() => {
      this.newComponent.quantity = 1;
      console.log('Add component - quantity set to:', this.newComponent.quantity);
    }, 50);
    
    console.log('Add component - newComponent initialized:', this.newComponent);
  }

  cancelAdd() {
    this.showAddForm = false;
    this.resetNewComponent();
    this.categoryError = '';
    this.submitted = false;
    console.log('Form cancelled, newComponent reset');
  }

  resetNewComponent() {
    this.newComponent = {
      itemId: null,
      stockId: null,
      quantity: 1,
      price: null,
      totalPrice: null,
      remarks: ''
    };
    this.categoryError = '';
    this.submitted = false;
    console.log('Reset newComponent - quantity set to:', this.newComponent.quantity);
  }

  saveComponent() {
    this.submitted = true;
    
    console.log('Saving component with data:', this.newComponent);
    
    // Validate required fields
    if (!this.newComponent.itemId) {
      this.alertService.error('Please select an item');
      return;
    }
    if (!this.newComponent.quantity || this.newComponent.quantity <= 0) {
      this.alertService.error('Quantity must be greater than 0');
      return;
    }
    if (!this.newComponent.price || this.newComponent.price <= 0) {
      this.alertService.error('Price must be greater than 0');
      return;
    }

    // Additional validation for PC components
    if (this.categoryError) {
      this.alertService.error(this.categoryError);
      return;
    }

    // Final stock validation - check if quantity exceeds available stock
    const stockStatus = this.getStockStatus(this.newComponent.itemId);
    if (stockStatus.availableQty === 0) {
      let errorMessage = '';
      
      if (stockStatus.hasStock && stockStatus.hasZeroStock) {
        errorMessage = 'This item has stock entries but all quantities are zero. Please add stock first.';
      } else if (stockStatus.hasStock) {
        errorMessage = 'This item has stock entries but no available quantity. Please check stock records.';
      } else {
        errorMessage = 'No stock available for this item across all locations. Please add stock first.';
      }
      
      this.alertService.error(errorMessage);
      return;
    }
    
    if (this.newComponent.quantity > stockStatus.availableQty) {
      this.alertService.error(`Only ${stockStatus.availableQty} units are available in stock.`);
      return;
    }

    // Auto-calculate total price before saving
    this.calculateTotalPrice();
    
    // Validate total price
    if (!this.newComponent.totalPrice || this.newComponent.totalPrice <= 0) {
      this.alertService.error('Total price calculation failed. Please check price and quantity.');
      return;
    }

    this.loading = true;

    // Create PC component entry
    const componentData = {
      pcId: this.pc.id,
      itemId: this.newComponent.itemId,
      quantity: this.newComponent.quantity,
      price: this.newComponent.price,
      totalPrice: this.newComponent.totalPrice,
      status: this.newComponent.status,
      stockId: this.newComponent.stockId,
      remarks: this.newComponent.remarks || ''
    };

    console.log('Creating PC component with data:', componentData);

    // Show confirmation dialog about stock deduction
    const confirmMessage = `Are you sure you want to add this component?\n\nThis will deduct ${this.newComponent.quantity} units from the stock quantity, just like disposal.\n\nItem: ${this.getItemName(this.newComponent.itemId)}\nQuantity: ${this.newComponent.quantity}\nPrice: php${this.newComponent.price}`;
    
    if (confirm(confirmMessage)) {
      this.pcComponentService.create(componentData)
        .pipe(first())
        .subscribe({
          next: (result) => {
            this.loading = false;
            this.alertService.success(`Component added successfully. Stock quantity reduced by ${this.newComponent.quantity} units.`);
            this.showAddForm = false;
            this.resetNewComponent();
            this.categoryError = '';
            this.submitted = false;
            
            // Refresh stock data and components after adding
            this.loadStocksForFiltering();
            this.loadExistingPCComponents(); // This will refresh both global and current components
            
            // Notify stock list component to refresh its data
            this.notifyStockListRefresh();
          },
          error: (error) => {
            this.loading = false;
            this.alertService.error('Error adding component: ' + error);
            console.error('Error adding component:', error);
          }
        });
    } else {
      this.loading = false;
    }
  }

  viewComponent(id: number) {
    this.router.navigate(['/stocks', id]);
  }

  editComponent(id: number) {
    this.router.navigate(['/stocks', id, 'edit']);
  }

  removeComponent(id: number) {
    // Find the component to get its details for the confirmation message
    const component = this.components.find(c => c.id === id);
    if (!component) {
      this.alertService.error('Component not found');
      return;
    }
    
    const confirmMessage = `Are you sure you want to remove this component from the PC?\n\nThis will restore ${component.quantity} units back to the stock quantity.\n\nItem: ${this.getItemName(component.itemId)}\nQuantity: ${component.quantity}\nPrice: php${component.price}`;
    
    if (confirm(confirmMessage)) {
      this.pcComponentService.delete(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success(`Component removed successfully. Stock quantity restored by ${component.quantity} units.`);
            
            // Refresh stock data and components after removing
            this.loadStocksForFiltering();
            this.loadExistingPCComponents(); // This will refresh both global and current components
            
            // Notify stock list component to refresh its data
            this.notifyStockListRefresh();
          },
          error: error => {
            this.alertService.error('Error removing component: ' + error);
          }
        });
    }
  }

  returnToStock(id: number) {
    // Find the component to get its details for the confirmation message
    const component = this.components.find(c => c.id === id);
    if (!component) {
      this.alertService.error('Component not found');
      return;
    }
    
    const confirmMessage = `Are you sure you want to return this component back to stock?\n\nThis will add ${component.quantity} units back to the global stock quantity.\n\nItem: ${this.getItemName(component.itemId)}\nQuantity: ${component.quantity}\nPrice: php${component.price}`;
    
    if (confirm(confirmMessage)) {
      this.pcComponentService.returnToStock(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success(`Component returned to stock successfully. Stock quantity increased by ${component.quantity} units.`);
            
            // Refresh stock data and components after returning to stock
            this.loadStocksForFiltering();
            this.loadExistingPCComponents(); // This will refresh both global and current components
            
            // Notify stock list component to refresh its data
            this.notifyStockListRefresh();
          },
          error: error => {
            this.alertService.error('Error returning component to stock: ' + error);
          }
        });
    }
  }

  // Method to notify stock list component to refresh its data
  private notifyStockListRefresh() {
    // Dispatch a custom event that stock list component can listen to
    const event = new CustomEvent('stockDataChanged', {
      detail: {
        timestamp: new Date().getTime(),
        message: 'PC component added/removed - stock data updated'
      }
    });
    window.dispatchEvent(event);
    console.log('Stock data change event dispatched');
  }

  // Handle stock data changes from other components
  private handleStockDataChange(event: CustomEvent) {
    console.log('Stock data change detected in PC components:', event.detail);
    console.log('Refreshing PC component stock data...');
    
    // Refresh stock data to get updated quantities
    this.loadStocksForFiltering();
    
    // Refresh global PC components to get accurate available stock
    this.loadExistingPCComponents();
    
    // Re-filter available items with updated stock data
    setTimeout(() => {
      this.filterAvailableItems();
    }, 100);
    
    // Show a brief notification
    this.alertService.info('Stock data updated - quantities refreshed');
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }

  // Notify PC list component about component status changes
  private notifyComponentStatusChange() {
    const event = new CustomEvent('componentStatusChanged', {
      detail: {
        timestamp: new Date().getTime(),
        message: 'Component status updated - PC status may need auto-update'
      }
    });
    window.dispatchEvent(event);
    console.log('Component status change event dispatched');
  }

  // Status-related methods
  updateComponentStatus(component: PCComponent) {
    console.log('Updating component status:', component.id, 'to:', component.status);
    
    this.pcComponentService.update(component.id!, {
      status: component.status
    })
    .pipe(first())
    .subscribe({
      next: () => {
        this.alertService.success(`Component status updated to ${component.status}`);
        // Refresh components to get updated data
        this.loadCurrentPCComponents();
        
        // Notify PC list component about status change
        this.notifyComponentStatusChange();
      },
      error: (error) => {
        this.alertService.error('Error updating component status: ' + error);
        console.error('Error updating component status:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Working':
        return 'form-select-success';
      case 'Missing':
        return 'form-select-danger';
      case 'Not Working':
        return 'form-select-danger';
      case 'Maintenance':
        return 'form-select-warning';
      default:
        return '';
    }
  }

  getComponentRowClass(component: PCComponent): string {
    switch (component.status) {
      case 'Working':
        return '';
      case 'Missing':
        return 'table-danger';
      case 'Not Working':
        return 'table-danger';
      case 'Maintenance':
        return 'table-warning';
      default:
        return '';
    }
  }

  getPCStatus(): { status: string; class: string; hasIssues: boolean } {
    if (this.components.length === 0) {
      return { status: 'No Components', class: 'text-muted', hasIssues: false };
    }

    const hasMissing = this.components.some(c => c.status === 'Missing');
    const hasNotWorking = this.components.some(c => c.status === 'Not Working');
    const hasMaintenance = this.components.some(c => c.status === 'Maintenance');
    const allWorking = this.components.every(c => c.status === 'Working');

    if (hasMissing || hasNotWorking) {
      return { status: 'Not Working', class: 'text-danger', hasIssues: true };
    } else if (hasMaintenance) {
      return { status: 'Maintenance', class: 'text-warning', hasIssues: true };
    } else if (allWorking) {
      return { status: 'Working', class: 'text-success', hasIssues: false };
    } else {
      return { status: 'Unknown', class: 'text-muted', hasIssues: false };
    }
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    
    const userRole = account.role;
    return roles.some(role => role === userRole);
  }
} 