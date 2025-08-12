import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { StorageLocationService, RoomLocationService } from '../../_services';
import { ItemService } from '../../_services/item.service';
import { AlertService } from '../../_services/alert.service';
import { Role } from '../../_models';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-storage-location-list',
  templateUrl: './storage-location-list.component.html',
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
      font-size: 2.5rem;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
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

    .location-row {
      transition: all 0.3s ease;
    }

    .location-row:hover {
      background-color: #f8f9fa;
      transform: scale(1.01);
    }

    .id-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .location-type-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.1);
    }

    .location-type-badge.text-primary {
      background: rgba(0, 123, 255, 0.1);
    }

    .location-type-badge.text-success {
      background: rgba(40, 167, 69, 0.1);
    }

    .location-type-badge i {
      font-size: 0.9rem;
    }

    .description-text {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .items-count-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .date-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
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
export class StorageLocationListComponent implements OnInit {
  Role = Role;
  locations: any[] = [];
  filteredLocations: any[] = [];
  items: any[] = [];
  loading = false;
  searchTerm = '';
  selectedSort = 'name';
  selectedType = '';
  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  constructor(
    private storageLocationService: StorageLocationService,
    private roomLocationService: RoomLocationService,
    private itemService: ItemService,
    private alertService: AlertService,
    public accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadLocations();
    this.loadItems();
  }

  loadLocations() {
    this.loading = true;
    
    // Load storage locations
    this.storageLocationService.getAll()
      .pipe(first())
      .subscribe({
        next: (storageLocations) => {
          // Add type information to storage locations
          const storageWithType = storageLocations.map(loc => ({
            ...loc,
            locationType: 'Storage Location',
            typeIcon: 'fas fa-box',
            typeColor: 'text-primary'
          }));

          // Load room locations
          this.roomLocationService.getAll()
            .pipe(first())
            .subscribe({
              next: (roomLocations) => {
                // Add type information to room locations
                const roomWithType = roomLocations.map(loc => ({
                  ...loc,
                  locationType: 'Room Location',
                  typeIcon: 'fas fa-door-open',
                  typeColor: 'text-success'
                }));

                // Combine both types of locations
                this.locations = [...storageWithType, ...roomWithType];
                this.applyFilters();
                this.loading = false;
              },
              error: (error) => {
                this.alertService.error('Error loading room locations: ' + error);
                this.loading = false;
              }
            });
        },
        error: (error) => {
          this.alertService.error('Error loading storage locations: ' + error);
          this.loading = false;
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

  applyFilters() {
    let filtered = [...this.locations];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(location => {
        const name = (location.name || '').toLowerCase();
        const description = (location.description || '').toLowerCase();
        return name.includes(this.searchTerm.toLowerCase()) || 
               description.includes(this.searchTerm.toLowerCase());
      });
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(location => location.locationType === this.selectedType);
    }

    // Sort filter
    switch (this.selectedSort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'items':
        filtered.sort((a, b) => this.getLocationItemCount(b.id) - this.getLocationItemCount(a.id));
        break;
      case 'created':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    this.filteredLocations = filtered;
    this.currentPage = 1;
  }

  onSearch() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.applyFilters();
  }

  refreshData() {
    this.loadData();
    this.alertService.success('Data refreshed successfully');
  }

  getLocationItemCount(locationId: number): number {
    return this.items.filter(item => item.locationId === locationId).length;
  }

  getTotalItems(): number {
    return this.items.length;
  }

  getAverageItemsPerLocation(): number {
    if (this.locations.length === 0) return 0;
    return Math.round(this.items.length / this.locations.length);
  }

  getMostUsedLocation(): string {
    if (this.locations.length === 0) return 'N/A';
    
    let maxItems = 0;
    let mostUsedLocation = 'N/A';
    
    this.locations.forEach(location => {
      const itemCount = this.getLocationItemCount(location.id);
      if (itemCount > maxItems) {
        maxItems = itemCount;
        mostUsedLocation = location.name;
      }
    });
    
    return mostUsedLocation;
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    return roles.some(role => role === account.role);
  }

  viewLocation(id: number) {
    this.router.navigate(['/add/storage-locations/view', id]);
  }

  editLocation(id: number) {
    this.router.navigate(['/add/storage-locations/edit', id]);
  }

  deleteLocation(id: number) {
    if (confirm('Are you sure you want to delete this storage location?')) {
      this.storageLocationService.delete(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Storage location deleted successfully');
            this.loadLocations();
          },
          error: (error) => {
            this.alertService.error('Error deleting storage location');
          }
        });
    }
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredLocations.length / this.itemsPerPage);
  }

  get paginatedLocations(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLocations.slice(start, end);
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
