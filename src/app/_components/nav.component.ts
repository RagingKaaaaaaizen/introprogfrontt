import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
  selector: 'app-nav',
  template: `
    <!-- Mobile Overlay -->
    <div class="sidebar-overlay" 
         [class.active]="isMobileOpen" 
         (click)="closeMobileSidebar()"></div>
    
    <!-- Sidebar -->
    <div class="sidebar" 
         [ngClass]="{ 
           'collapsed': isCollapsed && !isMobile, 
           'mobile-open': isMobileOpen,
           'mobile': isMobile 
         }">
      
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="brand">
          <i class="fas fa-boxes"></i>
          <span class="brand-text" *ngIf="!isCollapsed || isMobile">Inventory Pro</span>
        </div>
        <div class="header-actions">
          <button class="toggle-btn mobile-toggle" 
                  (click)="toggleMobileSidebar()"
                  *ngIf="isMobile">
            <i class="fas fa-bars"></i>
          </button>
          <button class="toggle-btn desktop-toggle" 
                  (click)="toggleSidebar()"
                  *ngIf="!isMobile">
            <i class="fas fa-chevron-left" [class.rotated]="isCollapsed"></i>
          </button>
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="user-profile" *ngIf="accountService.accountValue">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-info" *ngIf="!isCollapsed || isMobile">
          <div class="user-name">{{ accountService.accountValue.firstName }} {{ accountService.accountValue.lastName }}</div>
          <div class="user-role">{{ accountService.accountValue.role }}</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <!-- Dashboard -->
          <li class="nav-item">
            <a class="nav-link" 
               routerLink="/" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               (click)="closeMobileSidebar()">
              <i class="fas fa-tachometer-alt"></i>
              <span *ngIf="!isCollapsed || isMobile">Dashboard</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Dashboard</span>
            </a>
          </li>

          <!-- Stocks -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin, Role.Admin, Role.Viewer])">
            <a class="nav-link" 
               routerLink="/stocks" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-boxes"></i>
              <span *ngIf="!isCollapsed || isMobile">Stocks</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Stocks</span>
            </a>
          </li>

          <!-- Disposals -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin, Role.Admin, Role.Viewer])">
            <a class="nav-link" 
               routerLink="/dispose" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-trash-alt"></i>
              <span *ngIf="!isCollapsed || isMobile">Disposals</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Disposals</span>
            </a>
          </li>

          <!-- Add Items -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin, Role.Admin])">
            <a class="nav-link" 
               routerLink="/add" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-plus-circle"></i>
              <span *ngIf="!isCollapsed || isMobile">Add Items</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Add Items</span>
            </a>
          </li>

          <!-- PC Management -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin, Role.Admin, Role.Viewer])">
            <a class="nav-link" 
               routerLink="/pc" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-desktop"></i>
              <span *ngIf="!isCollapsed || isMobile">PC Management</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">PC Management</span>
            </a>
          </li>

          <!-- Admin Panel -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin])">
            <a class="nav-link" 
               routerLink="/admin" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-cogs"></i>
              <span *ngIf="!isCollapsed || isMobile">Admin Panel</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Admin Panel</span>
            </a>
          </li>

          <!-- Manage Accounts -->
          <li class="nav-item" *ngIf="hasRole([Role.SuperAdmin])">
            <a class="nav-link" 
               routerLink="/admin/accounts" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-users-cog"></i>
              <span *ngIf="!isCollapsed || isMobile">Manage Accounts</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Manage Accounts</span>
            </a>
          </li>

          <!-- Profile -->
          <li class="nav-item">
            <a class="nav-link" 
               routerLink="/profile" 
               routerLinkActive="active"
               (click)="closeMobileSidebar()">
              <i class="fas fa-user"></i>
              <span *ngIf="!isCollapsed || isMobile">Profile</span>
              <span class="tooltip" *ngIf="isCollapsed && !isMobile">Profile</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span *ngIf="!isCollapsed || isMobile">Logout</span>
          <span class="tooltip" *ngIf="isCollapsed && !isMobile">Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      box-shadow: 2px 0 20px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .sidebar.mobile {
      transform: translateX(-100%);
      width: 280px;
    }

    .sidebar.mobile-open {
      transform: translateX(0);
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      min-height: 80px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .brand i {
      font-size: 2rem;
      color: #ffd700;
      transition: all 0.3s ease;
    }

    .brand-text {
      transition: all 0.3s ease;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .toggle-btn:hover {
      background: rgba(255,255,255,0.1);
      transform: scale(1.1);
    }

    .toggle-btn.rotated i {
      transform: rotate(180deg);
    }

    .mobile-toggle {
      display: none;
    }

    .desktop-toggle {
      display: flex;
    }

    .user-profile {
      display: flex;
      align-items: center;
      padding: 20px;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      min-height: 80px;
    }

    .user-avatar i {
      font-size: 2.5rem;
      color: #ffd700;
    }

    .user-info {
      flex: 1;
      transition: all 0.3s ease;
    }

    .user-name {
      font-weight: bold;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .user-role {
      font-size: 0.8rem;
      opacity: 0.8;
      text-transform: capitalize;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 5px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.1);
      border-left-color: #ffd700;
      color: white;
      text-decoration: none;
      transform: translateX(5px);
    }

    .nav-link.active {
      background: rgba(255,255,255,0.15);
      border-left-color: #ffd700;
    }

    .nav-link i {
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .tooltip {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1001;
      margin-left: 10px;
    }

    .tooltip::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: #333;
    }

    .nav-link:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }

    .logout-btn i {
      font-size: 1.1rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 280px;
      }
      
      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .mobile-toggle {
        display: flex;
      }

      .desktop-toggle {
        display: none;
      }

      .sidebar.collapsed {
        width: 280px;
      }

      .brand-text,
      .user-info,
      .nav-link span,
      .logout-btn span {
        display: block !important;
      }

      .tooltip {
        display: none !important;
      }
    }

    @media (min-width: 769px) {
      .sidebar-overlay {
        display: none;
      }
    }

    /* Scrollbar Styling */
    .sidebar-nav::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.5);
    }
  `]
})
export class NavComponent {
  Role = Role;
  isCollapsed = false;
  isMobile = false;
  isMobileOpen = false;

  constructor(
    private router: Router,
    public accountService: AccountService
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileOpen = false;
    }
  }

  hasRole(roles: Role[]): boolean {
    const account = this.accountService.accountValue;
    if (!account) return false;
    
    const userRole = account.role;
    return roles.some(role => role === userRole);
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleMobileSidebar() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  closeMobileSidebar() {
    if (this.isMobile) {
      this.isMobileOpen = false;
    }
  }

  logout() {
    this.accountService.logout();
  }
} 