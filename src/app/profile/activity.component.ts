import { Component, OnInit, Input } from '@angular/core';
import { ActivityLogService, AccountService } from '@app/_services';
import { ActivityLog, ActivityAction, EntityType, Account } from '@app/_models';

@Component({
    selector: 'app-activity-log',
    templateUrl: 'activity.component.html',
    styleUrls: ['activity.component.css']
})
export class ActivityComponent implements OnInit {
    @Input() userId?: number;
    @Input() entityType?: string;
    @Input() entityId?: number;
    @Input() showFilters = true;
    @Input() isAdmin = false;
    
    logs: ActivityLog[] = [];
    loading = false;
    currentPage = 0;
    pageSize = 20;
    hasMore = true;
    
    // User management for admins
    users: Account[] = [];
    selectedUserId: string | null = null;
    currentUser: Account | null = null;
    
    filters = {
        action: '',
        entityType: ''
    };
    
    actions = Object.values(ActivityAction);
    entityTypes = Object.values(EntityType);

    constructor(
        private activityLogService: ActivityLogService,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        this.loadCurrentUser();
        if (this.isAdmin) {
            this.loadUsers();
        }
        this.loadLogs();
    }

    loadLogs(reset = false) {
        if (reset) {
            this.currentPage = 0;
            this.logs = [];
        }
        
        this.loading = true;
        
        const offset = this.currentPage * this.pageSize;
        
        let observable;
        
        // Priority order: selected user > input userId > entity > all
        if (this.selectedUserId && this.canViewOtherUserLogs()) {
            // Admin viewing specific user's logs
            observable = this.activityLogService.getUserActivity(Number(this.selectedUserId), this.pageSize, offset);
        } else if (this.userId) {
            // Component input userId
            observable = this.activityLogService.getUserActivity(this.userId, this.pageSize, offset);
        } else if (this.entityType && this.entityId) {
            // Entity-specific logs
            observable = this.activityLogService.getEntityActivity(this.entityType, this.entityId, this.pageSize);
        } else if (this.canViewOtherUserLogs()) {
            // Admin viewing all logs
            observable = this.activityLogService.getAllActivity(this.pageSize, offset, this.filters);
        } else {
            // Regular user viewing their own logs
            observable = this.activityLogService.getMyActivity(this.pageSize, offset);
        }
        
        observable.subscribe({
            next: (newLogs) => {
                if (reset) {
                    this.logs = newLogs;
                } else {
                    this.logs.push(...newLogs);
                }
                this.hasMore = newLogs.length === this.pageSize;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading activity logs:', error);
                this.loading = false;
            }
        });
    }

    loadMore() {
        if (!this.loading && this.hasMore) {
            this.currentPage++;
            this.loadLogs();
        }
    }

    applyFilters() {
        this.loadLogs(true);
    }

    clearFilters() {
        this.filters = { action: '', entityType: '' };
        this.loadLogs(true);
    }

    getActionDisplayName(action: string): string {
        return action.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    getEntityTypeDisplayName(entityType: string): string {
        return entityType.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    viewDetails(log: ActivityLog) {
        console.log('Activity log details:', log);
        // You can implement a modal or expandable view here
    }

    // Load current user information
    loadCurrentUser() {
        // Get current user from the account service
        this.currentUser = this.accountService.accountValue;
        if (this.currentUser) {
            this.isAdmin = this.currentUser.role === 'Admin' || this.currentUser.role === 'SuperAdmin';
        }
    }

    // Load all users for admin selection
    loadUsers() {
        this.accountService.getAll().subscribe({
            next: (users) => {
                this.users = users;
            },
            error: (error) => {
                console.error('Error loading users:', error);
            }
        });
    }

    // Handle user selection change
    onUserChange() {
        this.currentPage = 0;
        this.logs = [];
        this.loadLogs();
    }

    // Get display name for user selection
    getUserDisplayName(user: Account): string {
        return `${user.title} ${user.firstName} ${user.lastName} (${user.role})`;
    }

    // Check if current user can view other users' logs
    canViewOtherUserLogs(): boolean {
        return this.isAdmin && this.currentUser && 
               (this.currentUser.role === 'Admin' || this.currentUser.role === 'SuperAdmin');
    }

    // Get the name of the selected user
    getSelectedUserName(): string {
        if (!this.selectedUserId) return '';
        const selectedUser = this.users.find(user => user.id === this.selectedUserId);
        return selectedUser ? `${selectedUser.title} ${selectedUser.firstName} ${selectedUser.lastName}` : 'Unknown User';
    }
}
