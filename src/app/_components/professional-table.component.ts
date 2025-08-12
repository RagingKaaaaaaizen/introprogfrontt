import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'action' | 'icon';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  disabled?: boolean;
}

@Component({
  selector: 'app-professional-table',
  template: `
    <div class="table-container">
      <!-- Table Header -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title">
          <h5>
            <i [class]="titleIcon"></i>
            {{ title }}
          </h5>
          <p class="table-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="table-actions">
          <ng-content select="[table-actions]"></ng-content>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="table-controls" *ngIf="showSearch || showFilters">
        <div class="search-section" *ngIf="showSearch">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              class="form-control" 
              [placeholder]="searchPlaceholder"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
            >
          </div>
        </div>
        <div class="filters-section" *ngIf="showFilters">
          <ng-content select="[table-filters]"></ng-content>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="loading-text">{{ loadingText }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper" *ngIf="!loading">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th 
                  *ngFor="let column of columns" 
                  [style.width]="column.width"
                  [class.sortable]="column.sortable"
                  [class.text-center]="column.align === 'center'"
                  [class.text-end]="column.align === 'right'"
                  (click)="onSort(column.key)"
                >
                  <div class="th-content">
                    <i [class]="getColumnIcon(column)" *ngIf="column.type === 'icon'"></i>
                    <span>{{ column.label }}</span>
                    <i 
                      class="fas fa-sort" 
                      *ngIf="column.sortable && sortKey !== column.key"
                    ></i>
                    <i 
                      class="fas fa-sort-up" 
                      *ngIf="column.sortable && sortKey === column.key && sortDirection === 'asc'"
                    ></i>
                    <i 
                      class="fas fa-sort-down" 
                      *ngIf="column.sortable && sortKey === column.key && sortDirection === 'desc'"
                    ></i>
                  </div>
                </th>
                <th class="actions-column" *ngIf="actions.length > 0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let item of paginatedData; trackBy: trackByFn"
                [class.highlight-row]="item.highlighted"
                [class.selected-row]="selectedRows.includes(item.id)"
              >
                <td 
                  *ngFor="let column of columns"
                  [class.text-center]="column.align === 'center'"
                  [class.text-end]="column.align === 'right'"
                >
                  <!-- Text Type -->
                  <span *ngIf="column.type === 'text' || !column.type">
                    {{ getCellValue(item, column.key) }}
                  </span>

                  <!-- Number Type -->
                  <span *ngIf="column.type === 'number'" class="number-cell">
                    {{ getCellValue(item, column.key) | number }}
                  </span>

                  <!-- Date Type -->
                  <span *ngIf="column.type === 'date'" class="date-cell">
                    {{ getCellValue(item, column.key) | date:'mediumDate' }}
                  </span>

                  <!-- Badge Type -->
                  <span 
                    *ngIf="column.type === 'badge'" 
                    class="badge"
                    [ngClass]="getBadgeClass(item, column.key)"
                  >
                    {{ getCellValue(item, column.key) }}
                  </span>

                  <!-- Icon Type -->
                  <i 
                    *ngIf="column.type === 'icon'" 
                    [class]="getCellValue(item, column.key)"
                    [title]="getCellTooltip(item, column.key)"
                  ></i>
                </td>

                <!-- Actions Column -->
                <td class="actions-cell" *ngIf="actions.length > 0">
                  <div class="action-buttons">
                    <button 
                      *ngFor="let action of actions"
                      class="btn btn-sm"
                      [ngClass]="'btn-outline-' + (action.color || 'primary')"
                      [disabled]="action.disabled"
                      [title]="action.label"
                      (click)="onAction(action.action, item)"
                    >
                      <i [class]="action.icon"></i>
                      <span class="action-label">{{ action.label }}</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr *ngIf="paginatedData.length === 0">
                <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="empty-state">
                  <div class="empty-content">
                    <i class="fas fa-inbox"></i>
                    <h6>{{ emptyStateTitle }}</h6>
                    <p>{{ emptyStateMessage }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-section" *ngIf="showPagination && totalItems > 0">
        <div class="pagination-info">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} entries
        </div>
        <nav aria-label="Table pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" (click)="previousPage()">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
              <a class="page-link" (click)="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <a class="page-link" (click)="nextPage()">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: var(--white);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      overflow: hidden;
    }

    .table-header {
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      border-bottom: 1px solid var(--gray-200);
      padding: var(--space-6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .table-title h5 {
      margin: 0;
      font-weight: var(--font-weight-semibold);
      color: var(--gray-900);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .table-title h5 i {
      color: var(--primary);
    }

    .table-subtitle {
      margin: var(--space-1) 0 0 0;
      color: var(--gray-600);
      font-size: var(--font-size-sm);
    }

    .table-controls {
      padding: var(--space-6);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .search-box {
      position: relative;
      min-width: 300px;
    }

    .search-box i {
      position: absolute;
      left: var(--space-4);
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray-400);
      z-index: 2;
    }

    .search-box input {
      padding-left: var(--space-10);
    }

    .loading-state {
      padding: var(--space-12);
      text-align: center;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .loading-text {
      color: var(--gray-600);
      margin: 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .table {
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
    }

    .table thead th {
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      border: none;
      padding: var(--space-4) var(--space-6);
      font-weight: var(--font-weight-semibold);
      color: var(--gray-700);
      text-transform: uppercase;
      font-size: var(--font-size-sm);
      letter-spacing: 0.05em;
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 2px solid var(--gray-200);
    }

    .table thead th.sortable {
      cursor: pointer;
      transition: var(--transition-base);
    }

    .table thead th.sortable:hover {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .table tbody tr {
      transition: var(--transition-base);
      border-bottom: 1px solid var(--gray-100);
    }

    .table tbody tr:hover {
      background-color: var(--primary-50);
      transform: scale(1.01);
      box-shadow: var(--shadow-sm);
    }

    .table tbody tr.selected-row {
      background-color: var(--primary-100);
      border-left: 4px solid var(--primary);
    }

    .table tbody td {
      padding: var(--space-4) var(--space-6);
      vertical-align: middle;
      border: none;
      color: var(--gray-700);
    }

    .number-cell {
      font-weight: var(--font-weight-semibold);
      color: var(--gray-900);
    }

    .date-cell {
      color: var(--gray-600);
      font-size: var(--font-size-sm);
    }

    .actions-cell {
      width: 1%;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .action-label {
      display: none;
    }

    .empty-state {
      text-align: center;
      padding: var(--space-12);
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .empty-content i {
      font-size: var(--font-size-4xl);
      color: var(--gray-400);
    }

    .empty-content h6 {
      margin: 0;
      color: var(--gray-700);
    }

    .empty-content p {
      margin: 0;
      color: var(--gray-600);
    }

    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
      }

      .table-controls {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
      }

      .search-box {
        min-width: 100%;
      }

      .table thead th {
        padding: var(--space-3) var(--space-4);
        font-size: var(--font-size-xs);
      }

      .table tbody td {
        padding: var(--space-3) var(--space-4);
        font-size: var(--font-size-sm);
      }

      .action-label {
        display: none;
      }
    }

    @media (max-width: 576px) {
      .table thead th {
        padding: var(--space-2) var(--space-3);
        font-size: var(--font-size-xs);
      }

      .table tbody td {
        padding: var(--space-2) var(--space-3);
        font-size: var(--font-size-xs);
      }

      .action-buttons {
        flex-direction: column;
        gap: var(--space-1);
      }
    }
  `]
})
export class ProfessionalTableComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() titleIcon: string = 'fas fa-table';
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() loadingText: string = 'Loading data...';
  @Input() showHeader: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() showFilters: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() emptyStateTitle: string = 'No data found';
  @Input() emptyStateMessage: string = 'Try adjusting your search or filters';
  @Input() itemsPerPage: number = 10;
  @Input() selectedRows: string[] = [];

  @Output() actionClick = new EventEmitter<{action: string, item: any}>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{key: string, direction: 'asc' | 'desc'}>();
  @Output() pageChange = new EventEmitter<number>();

  searchTerm: string = '';
  currentPage: number = 1;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math;

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  get totalItems(): number {
    return this.data.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({key: this.sortKey, direction: this.sortDirection});
  }

  onAction(action: string, item: any): void {
    this.actionClick.emit({action, item});
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  getCellValue(item: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], item);
  }

  getColumnIcon(column: TableColumn): string {
    return this.getCellValue({}, column.key) || 'fas fa-circle';
  }

  getBadgeClass(item: any, key: string): string {
    const value = this.getCellValue(item, key);
    if (typeof value === 'string') {
      return `badge-${value.toLowerCase()}`;
    }
    return 'badge-secondary';
  }

  getCellTooltip(item: any, key: string): string {
    return this.getCellValue(item, key) || '';
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
} 