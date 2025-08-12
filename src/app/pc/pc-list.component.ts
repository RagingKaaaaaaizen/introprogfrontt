import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PCService, PCComponentService, RoomLocationService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
  selector: 'app-pc-list',
  templateUrl: './pc-list.component.html',
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

    .pc-info {
      display: flex;
      flex-direction: column;
    }

    .pc-info strong {
      color: #333;
      font-weight: 600;
    }

    .serial-number {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #6c757d;
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 8px;
      display: inline-block;
    }

    .location-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .assigned-to {
      font-weight: 500;
      color: #333;
    }

    .status-badge {
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
      text-align: center;
      min-width: 100px;
    }

    .badge-success {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .badge-warning {
      background: linear-gradient(135deg, #ffc107, #fd7e14);
      color: white;
    }

    .badge-danger {
      background: linear-gradient(135deg, #dc3545, #e83e8c);
      color: white;
    }

    .badge-secondary {
      background: linear-gradient(135deg, #6c757d, #495057);
      color: white;
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
export class PCListComponent implements OnInit {
  Role = Role;
  pcs: any[] = [];
  locations: any[] = [];
  pcComponents: any[] = [];
  filteredPCs: any[] = [];
  searchTerm = '';
  selectedStatus = '';
  selectedLocation = '';
  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  constructor(
    private router: Router,
    private pcService: PCService,
    private pcComponentService: PCComponentService,
    private locationService: RoomLocationService,
    private alertService: AlertService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    console.log('PC List Component - ngOnInit called');
    this.loadData();
    
    // Listen for component status changes
    window.addEventListener('componentStatusChanged', this.handleComponentStatusChange.bind(this));
  }

  loadData() {
    console.log('PC List Component - loadData called');
    this.loadPCs();
    this.loadLocations();
    this.loadPCComponents();
  }

  loadPCs() {
    console.log('PC List Component - loadPCs called');
    this.pcService.getAll()
      .pipe(first())
      .subscribe({
        next: (pcs) => {
          console.log('PC List Component - PCs loaded:', pcs);
          this.pcs = pcs;
          this.applyFilters();
        },
        error: error => {
          console.error('PC List Component - Error loading PCs:', error);
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

  loadPCComponents() {
    this.pcComponentService.getAll()
      .pipe(first())
      .subscribe({
        next: (components) => {
          this.pcComponents = components;
          // Auto-update PC statuses based on component statuses
          this.autoUpdatePCStatus();
        },
        error: error => {
          console.error('Error loading PC components:', error);
        }
      });
  }

  applyFilters() {
    let filtered = [...this.pcs];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(pc => {
        const pcName = pc.name.toLowerCase();
        const serialNumber = (pc.serialNumber || '').toLowerCase();
        const assignedTo = (pc.assignedTo || '').toLowerCase();
        return pcName.includes(this.searchTerm.toLowerCase()) ||
               serialNumber.includes(this.searchTerm.toLowerCase()) ||
               assignedTo.includes(this.searchTerm.toLowerCase());
      });
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(pc => pc.status === this.selectedStatus);
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(pc => pc.roomLocationId == this.selectedLocation);
    }

    this.filteredPCs = filtered;
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

  getActiveCount(): number {
    return this.pcs.filter(pc => pc.status === 'Active').length;
  }

  getMaintenanceCount(): number {
    return this.pcs.filter(pc => pc.status === 'Maintenance').length;
  }

  getAutoUpdatedCount(): number {
    return this.pcs.filter(pc => {
      const componentStatus = this.getComponentStatus(pc.id);
      return componentStatus.status !== 'No Components' && 
             (componentStatus.status === 'Not Working' || componentStatus.status === 'Maintenance');
    }).length;
  }

  getUniqueLocations(): number {
    const locationIds = [...new Set(this.pcs.map(pc => pc.roomLocationId))];
    return locationIds.length;
  }

  getLocationName(locationId: number): string {
    const location = this.locations.find(l => l.id === locationId);
    return location ? location.name : 'Unknown Location';
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    
    const userRole = account.role;
    return roles.some(role => role === userRole);
  }

  viewPC(id: number) {
    this.router.navigate(['/pc', id]);
  }

  viewComponents(id: number) {
    this.router.navigate(['/pc', id, 'components']);
  }

  editPC(id: number) {
    this.router.navigate(['/pc', id, 'edit']);
  }

  deletePC(id: number) {
    if (confirm('Are you sure you want to delete this PC?')) {
      this.pcService.delete(id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('PC deleted successfully');
            this.loadPCs();
          },
          error: error => {
            this.alertService.error(error);
          }
        });
    }
  }

  viewStock(pcId: number) {
    this.router.navigate(['/stocks'], { queryParams: { pcId } });
  }

  testNavigation() {
    console.log('Testing navigation to /pc/add');
    this.router.navigate(['/pc/add']);
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredPCs.length / this.itemsPerPage);
  }

  get paginatedPCs(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPCs.slice(start, end);
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

  getComponentStatus(pcId: number): { status: string; componentCount: number } {
    const pcComponents = this.pcComponents.filter(c => c.pcId === pcId);
    
    if (pcComponents.length === 0) {
      return { status: 'No Components', componentCount: 0 };
    }

    const hasMissing = pcComponents.some(c => c.status === 'Missing');
    const hasNotWorking = pcComponents.some(c => c.status === 'Not Working');
    const hasMaintenance = pcComponents.some(c => c.status === 'Maintenance');
    const allWorking = pcComponents.every(c => c.status === 'Working');

    if (hasMissing || hasNotWorking) {
      return { status: 'Not Working', componentCount: pcComponents.length };
    } else if (hasMaintenance) {
      return { status: 'Maintenance', componentCount: pcComponents.length };
    } else if (allWorking) {
      return { status: 'Working', componentCount: pcComponents.length };
    } else {
      return { status: 'Unknown', componentCount: pcComponents.length };
    }
  }

  // Auto-update PC status based on component statuses
  autoUpdatePCStatus() {
    this.pcs.forEach(pc => {
      const componentStatus = this.getComponentStatus(pc.id);
      let newPCStatus = pc.status; // Default to current status

      // Auto-update PC status based on component statuses
      if (componentStatus.status === 'Not Working') {
        newPCStatus = 'Maintenance'; // Set PC to Maintenance if components are not working
      } else if (componentStatus.status === 'Maintenance') {
        newPCStatus = 'Maintenance'; // Set PC to Maintenance if components are in maintenance
      } else if (componentStatus.status === 'Working' && pc.status === 'Maintenance') {
        // If all components are working but PC was in maintenance, set back to Active
        newPCStatus = 'Active';
      }

      // Only update if status actually changed
      if (newPCStatus !== pc.status) {
        console.log(`Auto-updating PC ${pc.name} status from ${pc.status} to ${newPCStatus}`);
        this.updatePCStatus(pc.id, newPCStatus);
      }
    });
  }

  // Update PC status
  private updatePCStatus(pcId: number, newStatus: string) {
    const pc = this.pcs.find(p => p.id === pcId);
    if (!pc) return;

    // Create a copy of the PC object with updated status
    const updatedPC = { ...pc, status: newStatus };
    
    this.pcService.update(pcId, updatedPC)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log(`PC ${pc.name} status updated to ${newStatus}`);
          // Update local PC data
          pc.status = newStatus;
          this.applyFilters(); // Refresh the filtered list
        },
        error: error => {
          console.error(`Error updating PC status:`, error);
          this.alertService.error('Error updating PC status');
        }
      });
  }

  // Handle component status changes
  private handleComponentStatusChange(event: CustomEvent) {
    console.log('Component status change detected, refreshing PC components...');
    this.loadPCComponents(); // This will trigger autoUpdatePCStatus
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('componentStatusChanged', this.handleComponentStatusChange.bind(this));
  }
} 