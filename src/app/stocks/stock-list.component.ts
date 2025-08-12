import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, StockService, ItemService, CategoryService, BrandService, StorageLocationService, PCService, PCComponentService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styles: [`
    .list-container {
      padding: 20px 0;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .page-header {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
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

    .header-actions .btn {
      border-radius: 25px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .header-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.2);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-number {
      font-size: 2.2rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .quantity-info, .in-use-info {
      min-width: 120px;
    }

    .quantity-info small, .in-use-info small {
      font-size: 0.75rem;
      line-height: 1.2;
    }

    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .search-box {
      position: relative;
    }

    .search-box i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #667eea;
      z-index: 1;
    }

    .search-box .form-control {
      padding-left: 45px;
      border-radius: 25px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }

    .search-box .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .filter-controls {
      display: flex;
      gap: 15px;
    }

    .filter-controls .form-select {
      border-radius: 25px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }

    .filter-controls .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .card {
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      margin-bottom: 25px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .card:hover {
      box-shadow: 0 16px 48px rgba(0,0,0,0.15);
      transform: translateY(-4px);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px 16px 0 0 !important;
      padding: 25px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-actions {
      display: flex;
      gap: 10px;
    }

    .table-actions .btn {
      border-radius: 20px;
      padding: 8px 16px;
      font-weight: 500;
    }

    .table {
      margin-bottom: 0;
    }

    .table thead th {
      background: #f8f9fa;
      border: none;
      padding: 15px;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    .table tbody td {
      padding: 15px;
      vertical-align: middle;
      border: none;
      border-bottom: 1px solid #f1f3f4;
    }

    .table tbody tr {
      transition: all 0.3s ease;
    }

    .table tbody tr:hover {
      background-color: #f8f9fa;
      transform: scale(1.005);
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-info strong {
      color: #333;
      font-weight: 600;
    }

    .category-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .brand-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
      border: 1px solid rgba(255, 193, 7, 0.2);
    }

    .location-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
      border: 1px solid rgba(40, 167, 69, 0.2);
    }

    .quantity-badge {
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
      text-align: center;
      min-width: 80px;
    }

    .quantity-positive {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .quantity-negative {
      background: linear-gradient(135deg, #dc3545, #e83e8c);
      color: white;
    }

    .quantity-zero {
      background: linear-gradient(135deg, #6c757d, #495057);
      color: white;
    }

    .price-value,
    .total-value {
      font-weight: 600;
      color: #333;
    }

    .total-price {
      font-weight: 600;
      color: #28a745;
    }

    .created-date {
      font-size: 0.85rem;
      color: #6c757d;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .action-buttons .btn {
      padding: 8px 12px;
      font-size: 0.8rem;
      border-radius: 20px;
      transition: all 0.3s ease;
      min-width: 40px;
    }

    .action-buttons .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }

    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }

    .empty-state h4 {
      color: #495057;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .pagination-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .pagination-info {
      color: #6c757d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .pagination {
      margin: 0;
    }

    .page-link {
      color: #667eea;
      border: none;
      padding: 10px 16px;
      margin: 0 3px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .page-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transform: translateY(-2px);
    }

    .page-item.active .page-link {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .page-item.disabled .page-link {
      color: #adb5bd;
      cursor: not-allowed;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .list-container {
        padding: 10px 0;
      }

      .page-header {
        padding: 20px;
        margin-bottom: 20px;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }

      .header-title {
        justify-content: center;
        margin-bottom: 20px;
      }

      .page-title {
        font-size: 2rem;
      }

      .header-actions {
        justify-content: center;
        flex-direction: column;
      }

      .header-actions .btn {
        width: 100%;
        margin-bottom: 10px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .stat-card {
        padding: 20px;
      }

      .stat-icon {
        font-size: 2rem;
      }

      .stat-number {
        font-size: 1.8rem;
      }

      .filters-section {
        padding: 20px;
      }

      .filter-controls {
        flex-direction: column;
        gap: 10px;
      }

      .card-header {
        padding: 20px;
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .table-responsive {
        border-radius: 0;
      }

      .table thead {
        display: none;
      }

      .table tbody tr {
        display: block;
        margin-bottom: 20px;
        border: 1px solid #dee2e6;
        border-radius: 12px;
        padding: 15px;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .table tbody td {
        display: block;
        text-align: left;
        padding: 8px 0;
        border: none;
      }

      .table tbody td::before {
        content: attr(data-label) ": ";
        font-weight: 600;
        color: #495057;
        margin-right: 10px;
      }

      .action-buttons {
        justify-content: center;
        margin-top: 15px;
      }

      .action-buttons .btn {
        flex: 1;
        max-width: 80px;
      }

      .pagination-section {
        flex-direction: column;
        text-align: center;
        padding: 20px;
      }

      .pagination {
        justify-content: center;
      }
    }

    /* Tablet Responsive */
    @media (min-width: 769px) and (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .header-actions {
        flex-direction: column;
        gap: 10px;
      }

      .filter-controls {
        flex-direction: column;
        gap: 10px;
      }
    }

    /* Large Desktop */
    @media (min-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(5, 1fr);
      }

      .container {
        max-width: 1400px;
      }
    }
  `]
})
export class StockListComponent implements OnInit {
  Role = Role;
  stocks: any[] = [];
  items: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  locations: any[] = [];
  pcs: any[] = [];
  pcComponents: any[] = [];
  filteredStocks: any[] = [];
  searchTerm = '';
  selectedType = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  constructor(
    private router: Router,
    private stockService: StockService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private locationService: StorageLocationService,
    private pcService: PCService,
    private pcComponentService: PCComponentService,
    private alertService: AlertService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    this.loadData();
    
    // Listen for stock data changes from PC components
    window.addEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('stockDataChanged', this.handleStockDataChange.bind(this));
  }

  loadData() {
    this.loadStocks();
    this.loadItems();
    this.loadCategories();
    this.loadBrands();
    this.loadLocations();
    this.loadPCs();
    this.loadPCComponents();
  }

  loadStocks() {
    this.stockService.getAll()
      .pipe(first())
      .subscribe({
        next: (stocks) => {
          this.stocks = stocks;
          this.applyFilters();
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  loadItems() {
    this.itemService.getAll()
      .pipe(first())
      .subscribe({
        next: (items) => {
          this.items = items;
        },
        error: error => {
          this.alertService.error(error);
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

  loadLocations() {
    this.locationService.getAll()
      .pipe(first())
      .subscribe({
        next: (locations) => {
          this.locations = locations;
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  loadPCs() {
    this.pcService.getAll()
      .pipe(first())
      .subscribe({
        next: (pcs) => {
          this.pcs = pcs;
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  loadPCComponents() {
    this.pcComponentService.getAll()
      .pipe(first())
      .subscribe({
        next: (components) => {
          this.pcComponents = components;
          console.log('PC Components loaded:', this.pcComponents.length);
        },
        error: error => {
          console.error('Error loading PC Components:', error);
          this.pcComponents = [];
        }
      });
  }

  applyFilters() {
    let filtered = [...this.stocks];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(stock => {
        const itemName = this.getItemName(stock.itemId).toLowerCase();
        return itemName.includes(this.searchTerm.toLowerCase());
      });
    }

    // Type filter
    if (this.selectedType) {
      if (this.selectedType === 'ADD') {
        filtered = filtered.filter(stock => !stock.disposeId);
      } else if (this.selectedType === 'DISPOSE') {
        filtered = filtered.filter(stock => stock.disposeId);
      }
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(stock => {
        const item = this.items.find(i => i.id === stock.itemId);
        return item && item.categoryId == this.selectedCategory;
      });
    }

    this.filteredStocks = filtered;
    this.currentPage = 1;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  refreshData() {
    this.loadData();
    this.alertService.success('Data refreshed successfully');
  }

  getAdditionsCount(): number {
    return this.stocks.filter(stock => !stock.disposeId).length;
  }

  getDisposalsCount(): number {
    return this.stocks.filter(stock => stock.disposeId).length;
  }

  getTotalValue(): number {
    return this.stocks.reduce((total, stock) => {
      return total + (stock.price * stock.quantity);
    }, 0);
  }

  getPCComponentsCount(): number {
    return this.pcComponents.length;
  }

  getItemName(itemId: number): string {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  }

  getCategoryName(stock: any): string {
    const item = this.items.find(i => i.id === stock.itemId);
    if (!item) return 'Unknown';
    
    const category = this.categories.find(c => c.id === item.categoryId);
    return category ? category.name : 'Unknown Category';
  }

  getBrandName(stock: any): string {
    const item = this.items.find(i => i.id === stock.itemId);
    if (!item) return 'Unknown';
    
    const brand = this.brands.find(b => b.id === item.brandId);
    return brand ? brand.name : 'Unknown Brand';
  }

  getLocationName(stock: any): string {
    const location = this.locations.find(l => l.id === stock.locationId);
    return location ? location.name : 'Unknown Location';
  }

  isItemInUse(itemId: number): boolean {
    // Check if any PC component is using this item
    return this.pcComponents.some(component => component.itemId === itemId);
  }

  getInUseCount(itemId: number): number {
    // Count total quantity used in PC components for this item
    return this.pcComponents
      .filter(component => component.itemId === itemId)
      .reduce((total, component) => total + component.quantity, 0);
  }

  getInUseDetails(itemId: number): string {
    const components = this.pcComponents.filter(component => component.itemId === itemId);
    if (components.length === 0) {
      return 'Available';
    }
    
    const totalQuantity = components.reduce((total, component) => total + component.quantity, 0);
    const pcCount = components.length;
    
    return `${totalQuantity} units in ${pcCount} PC${pcCount > 1 ? 's' : ''}`;
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    
    const userRole = account.role;
    return roles.some(role => role === userRole);
  }

  viewStock(id: number) {
    console.log('View stock clicked for ID:', id);
    this.router.navigate(['/stocks', id]);
  }

  editStock(id: number) {
    console.log('Edit stock clicked for ID:', id);
    this.router.navigate(['/stocks', id, 'edit']);
  }

  deleteStock(id: number) {
    console.log('Delete stock clicked for ID:', id);
    if (confirm('Are you sure you want to delete this stock entry?')) {
      this.stockService.delete(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Stock deleted successfully');
            this.loadStocks();
            
            // Notify other components about stock data change
            this.notifyStockDataChange();
          },
          error: error => {
            console.error('Error deleting stock:', error);
            this.alertService.error(error);
          }
        });
    }
  }

  disposeStock(stock: any) {
    console.log('Dispose stock clicked for stock:', stock);
    this.router.navigate(['/dispose/add'], { 
      queryParams: { 
        itemId: stock.itemId,
        availableStock: this.getAvailableStock(stock.itemId)
      }
    });
  }

  getAvailableStock(itemId: number): number {
    const itemStocks = this.stocks.filter(s => s.itemId === itemId);
    // Sum all positive quantities
    return itemStocks.filter(s => s.quantity > 0).reduce((sum, s) => sum + s.quantity, 0);
  }

  getStockSummary(itemId: number): { total: number; available: number; inUse: number; usedInPCs: number } {
    const totalStock = this.getAvailableStock(itemId);
    const inUseQuantity = this.getInUseCount(itemId);
    const availableQuantity = Math.max(0, totalStock - inUseQuantity);
    const usedInPCs = this.pcComponents.filter(component => component.itemId === itemId).length;
    
    return {
      total: totalStock,
      available: availableQuantity,
      inUse: inUseQuantity,
      usedInPCs: usedInPCs
    };
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredStocks.length / this.itemsPerPage);
  }

  get paginatedStocks(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredStocks.slice(start, end);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const end = Math.min(this.totalPages, start + maxPages - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Handle stock data changes from PC components
  private handleStockDataChange(event: CustomEvent) {
    console.log('Stock data change detected:', event.detail);
    console.log('Refreshing stock list data...');
    
    // Refresh all data to get updated stock quantities
    this.loadData();
    
    // Show a brief notification with more details
    const message = event.detail?.message || 'Stock data updated';
    this.alertService.info(`${message} - quantities refreshed globally`);
    
    // Broadcast the change to other components that might need updating
    this.broadcastStockChange(event.detail);
  }

  // Method to notify other components about stock data changes
  private notifyStockDataChange() {
    // Dispatch a custom event that other components can listen to
    const event = new CustomEvent('stockDataChanged', {
      detail: {
        timestamp: new Date().getTime(),
        message: 'Stock deleted - stock data updated'
      }
    });
    window.dispatchEvent(event);
    console.log('Stock data change event dispatched from stock list component');
  }

  // Broadcast stock changes to all components that might need updating
  private broadcastStockChange(detail: any) {
    // Dispatch additional events for specific components
    const events = [
      {
        name: 'pcStockDataChanged',
        detail: { ...detail, target: 'pc-components' }
      },
      {
        name: 'disposeStockDataChanged', 
        detail: { ...detail, target: 'dispose' }
      },
      {
        name: 'stockEditDataChanged',
        detail: { ...detail, target: 'stock-edit' }
      }
    ];

    events.forEach(eventInfo => {
      const event = new CustomEvent(eventInfo.name, {
        detail: eventInfo.detail
      });
      window.dispatchEvent(event);
      console.log(`Broadcasting ${eventInfo.name} event`);
    });
  }
}
