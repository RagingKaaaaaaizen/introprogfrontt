import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PCService, PCComponentService, RoomLocationService, StockService, ItemService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
  selector: 'app-pc-detail',
  templateUrl: './pc-detail.component.html',
  styles: [`
    .detail-container {
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

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
    }

    .info-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f8f9fa;
    }

    .card-header i {
      font-size: 1.5rem;
      color: #667eea;
    }

    .card-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f8f9fa;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: #495057;
    }

    .info-value {
      color: #333;
      text-align: right;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

    .components-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      margin-bottom: 30px;
    }

    .components-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .components-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .components-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }

    .summary-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .summary-number {
      font-size: 1.8rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .summary-label {
      font-size: 0.9rem;
      color: #6c757d;
      font-weight: 500;
    }

    .table-responsive {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .table {
      margin: 0;
    }

    .table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      border: none;
      padding: 15px;
    }

    .table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      vertical-align: middle;
    }

    .table tbody tr:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    .price-info {
      text-align: right;
    }

    .price-value {
      font-weight: bold;
      color: #28a745;
    }

    .price-label {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .stock-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .stock-quantity {
      font-weight: bold;
      color: #333;
    }

    .stock-status {
      font-size: 0.8rem;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .stock-available {
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }

    .stock-low {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .stock-out {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }

    .total-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    .total-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }

    .loading i {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 20px;
    }

    .error-state {
      text-align: center;
      padding: 60px 20px;
      color: #dc3545;
    }

    .error-state i {
      font-size: 3rem;
      color: #dc3545;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .components-summary {
        grid-template-columns: repeat(2, 1fr);
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class PCDetailComponent implements OnInit {
  Role = Role;
  pc: any = null;
  pcComponents: any[] = [];
  stocks: any[] = [];
  items: any[] = [];
  locations: any[] = [];
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pcService: PCService,
    private pcComponentService: PCComponentService,
    private stockService: StockService,
    private itemService: ItemService,
    private locationService: RoomLocationService,
    private alertService: AlertService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    const pcId = this.route.snapshot.params['id'];
    if (pcId) {
      this.loadPCDetail(pcId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadPCDetail(pcId: number) {
    this.loading = true;
    this.error = false;

    // Load PC details
    this.pcService.getById(pcId)
      .pipe(first())
      .subscribe({
        next: (pc) => {
          this.pc = pc;
          this.loadPCComponents(pcId);
          this.loadSupportingData();
        },
        error: (error) => {
          console.error('Error loading PC details:', error);
          this.error = true;
          this.loading = false;
          this.alertService.error('Error loading PC details');
        }
      });
  }

  loadPCComponents(pcId: number) {
    this.pcComponentService.getByPCId(pcId)
      .pipe(first())
      .subscribe({
        next: (components) => {
          this.pcComponents = components;
        },
        error: (error) => {
          console.error('Error loading PC components:', error);
        }
      });
  }

  loadSupportingData() {
    // Load stocks, items, and locations in parallel
    Promise.all([
      this.stockService.getAll().pipe(first()).toPromise(),
      this.itemService.getAll().pipe(first()).toPromise(),
      this.locationService.getAll().pipe(first()).toPromise()
    ]).then(([stocks, items, locations]) => {
      this.stocks = stocks || [];
      this.items = items || [];
      this.locations = locations || [];
      this.loading = false;
    }).catch((error) => {
      console.error('Error loading supporting data:', error);
      this.loading = false;
    });
  }

  getLocationName(locationId: number): string {
    const location = this.locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  }

  getItemDetails(itemId: number): any {
    return this.items.find(item => item.id === itemId) || {};
  }

  getStockDetails(stockId: number): any {
    return this.stocks.find(stock => stock.id === stockId) || {};
  }

  getStockStatus(stockId: number): { status: string, class: string } {
    const stock = this.getStockDetails(stockId);
    if (!stock || stock.quantity === undefined) {
      return { status: 'Unknown', class: 'stock-out' };
    }
    
    if (stock.quantity === 0) {
      return { status: 'Out of Stock', class: 'stock-out' };
    } else if (stock.quantity < 10) {
      return { status: 'Low Stock', class: 'stock-low' };
    } else {
      return { status: 'Available', class: 'stock-available' };
    }
  }

  getComponentStatusCount(status: string): number {
    return this.pcComponents.filter(comp => comp.status === status).length;
  }

  getTotalComponentValue(): number {
    return this.pcComponents.reduce((total, comp) => total + (comp.totalPrice || 0), 0);
  }

  getTotalComponentQuantity(): number {
    return this.pcComponents.reduce((total, comp) => total + (comp.quantity || 0), 0);
  }

  getWorkingComponentsCount(): number {
    return this.pcComponents.filter(comp => comp.status === 'Working').length;
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    return account && roles.includes(account.role as Role);
  }

  goBack() {
    this.router.navigate(['/pc']);
  }

  editPC() {
    if (this.pc) {
      this.router.navigate(['/pc/edit', this.pc.id]);
    }
  }

  viewComponents() {
    if (this.pc) {
      this.router.navigate(['/pc/components', this.pc.id]);
    }
  }
}
