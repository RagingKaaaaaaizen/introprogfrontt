import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { DisposeService } from '../_services/dispose.service';
import { Dispose } from '../_models';
import { AccountService, AlertService, CategoryService, StorageLocationService } from '@app/_services';
import { Role } from '../_models';

@Component({
  selector: 'app-dispose-list',
  templateUrl: './dispose-list.component.html',
  styles: [`
    .list-container {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      text-align: center;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 3rem;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #666;
      font-size: 1rem;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .search-box {
      position: relative;
    }

    .search-box i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      z-index: 1;
    }

    .search-box .form-control {
      padding-left: 45px;
    }

    .filter-controls {
      display: flex;
      gap: 10px;
    }

    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-actions {
      display: flex;
      gap: 10px;
    }

    .disposal-row {
      transition: all 0.3s ease;
    }

    .disposal-row:hover {
      background-color: #f8f9fa;
      transform: scale(1.01);
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .category-badge,
    .brand-badge,
    .location-badge,
    .user-badge,
    .date-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .quantity-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .price-value,
    .total-value {
      font-weight: 600;
      color: #333;
    }

    .reason-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }

    .action-buttons .btn {
      padding: 6px 10px;
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state i {
      font-size: 4rem;
      color: #ddd;
      margin-bottom: 20px;
    }

    .empty-state h4 {
      color: #333;
      margin-bottom: 10px;
    }

    .pagination-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .pagination-info {
      color: #666;
      font-size: 0.9rem;
    }

    .pagination {
      margin: 0;
    }

    .page-link {
      color: #667eea;
      border: none;
      padding: 8px 12px;
      margin: 0 2px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .page-item.active .page-link {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .page-item.disabled .page-link {
      color: #ccc;
      cursor: not-allowed;
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

      .filter-controls {
        flex-direction: column;
      }

      .pagination-section {
        flex-direction: column;
        text-align: center;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class DisposeListComponent implements OnInit {
  Role = Role;
  disposals: Dispose[] = [];
  filteredDisposals: Dispose[] = [];
  categories: any[] = [];
  locations: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedCategory = '';
  selectedLocation = '';
  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  constructor(
    private disposeService: DisposeService,
    private categoryService: CategoryService,
    private locationService: StorageLocationService,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadDisposals();
    this.loadCategories();
    this.loadLocations();
  }

  loadDisposals() {
    this.loading = true;
    console.log('Loading disposal records...');
    
    this.disposeService.getAll()
      .pipe(first())
      .subscribe({
        next: (disposals) => {
          console.log('Disposals loaded:', disposals);
          this.disposals = disposals;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading disposals:', error);
          this.loading = false;
          this.alertService.error('Error loading disposal records: ' + (error.error?.message || error.message || 'Unknown error'));
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

  applyFilters() {
    let filtered = [...this.disposals];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(disposal => {
        const itemName = (disposal.item?.name || 'Unknown Item').toLowerCase();
        const reason = (disposal.reason || '').toLowerCase();
        return itemName.includes(this.searchTerm.toLowerCase()) || 
               reason.includes(this.searchTerm.toLowerCase());
      });
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(disposal => {
        const categoryName = disposal.item?.category?.name || '';
        return categoryName.toLowerCase().includes(this.selectedCategory.toLowerCase());
      });
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(disposal => {
        return disposal.locationId == Number(this.selectedLocation);
      });
    }

    this.filteredDisposals = filtered;
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

  getThisMonthDisposals(): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return this.disposals.filter(disposal => {
      const disposalDate = new Date(disposal.disposalDate);
      return disposalDate.getMonth() === thisMonth && disposalDate.getFullYear() === thisYear;
    }).length;
  }

  viewDisposal(id: number) {
    console.log('View disposal clicked for ID:', id);
    this.router.navigate(['/dispose/view', id]);
  }

  editDisposal(id: number) {
    console.log('Edit disposal clicked for ID:', id);
    this.router.navigate(['/dispose/edit', id]);
  }

  deleteDisposal(id: number) {
    console.log('Delete disposal clicked for ID:', id);
    if (confirm('Are you sure you want to delete this disposal record?')) {
      this.disposeService.delete(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Disposal record deleted successfully');
            this.loadDisposals();
          },
          error: (error) => {
            console.error('Error deleting disposal:', error);
            this.alertService.error('Error deleting disposal record');
          }
        });
    }
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    return roles.some(role => role === account.role);
  }

  getTotalDisposalValue(): number {
    return this.disposals.reduce((sum, disposal) => sum + (disposal.totalValue || 0), 0);
  }

  getTotalDisposedItems(): number {
    return this.disposals.reduce((sum, disposal) => sum + (disposal.quantity || 0), 0);
  }

  viewStockInfo(itemId: number) {
    console.log('View stock info clicked for item ID:', itemId);
    this.router.navigate(['/stocks'], { queryParams: { highlightItem: itemId } });
  }

  addNewDisposal() {
    console.log('Add new disposal clicked');
    this.router.navigate(['/dispose/add']);
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredDisposals.length / this.itemsPerPage);
  }

  get paginatedDisposals(): Dispose[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDisposals.slice(start, end);
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
} 