import { Component } from '@angular/core';
import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Component({ 
  templateUrl: 'home.component.html',
  styles: [`
    .dashboard-container {
      padding: 20px 0;
    }

    .welcome-section {
      margin-bottom: 30px;
    }

    .welcome-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
      padding: 30px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .welcome-icon i {
      font-size: 4rem;
      color: #ffd700;
    }

    .welcome-content h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: bold;
    }

    .welcome-subtitle {
      margin: 10px 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .stats-section {
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-icon {
      margin-bottom: 15px;
    }

    .stat-icon i {
      font-size: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-content h3 {
      margin: 0 0 10px 0;
      font-weight: bold;
      color: #333;
    }

    .stat-number {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .permissions-section,
    .quick-actions-section {
      margin-bottom: 30px;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .permission-item i {
      color: #667eea;
      font-size: 1.2rem;
      width: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      text-align: center;
      cursor: pointer;
      position: relative;
      z-index: 1;
    }

    .action-item:hover {
      border-color: #667eea;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
      text-decoration: none;
      color: #333;
    }

    .action-item i {
      font-size: 2rem;
      color: #667eea;
    }

    .action-item span {
      font-weight: 600;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .welcome-card {
        flex-direction: column;
        text-align: center;
      }

      .welcome-content h1 {
        font-size: 2rem;
      }

      .stat-card {
        margin-bottom: 20px;
      }

      .permissions-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
    Role = Role;
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }

    hasRole(roles: Role[]): boolean {
        const account = this.accountService.accountValue;
        return account && roles.includes(account.role as Role);
    }
}