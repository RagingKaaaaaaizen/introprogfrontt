import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ 
    templateUrl: 'details.component.html',
    styles: [`
        .profile-container {
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

        .profile-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            transition: all 0.3s ease;
        }

        .profile-card:hover {
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }

        .card {
            border: none;
            border-radius: 12px;
            overflow: hidden;
        }

        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-body {
            padding: 30px;
        }

        .profile-info {
            display: flex;
            gap: 30px;
            align-items: flex-start;
        }

        .profile-avatar {
            flex-shrink: 0;
        }

        .avatar-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.5rem;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .profile-details {
            flex: 1;
        }

        .detail-row {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .detail-label {
            flex: 0 0 150px;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .detail-label i {
            color: #667eea;
            width: 16px;
        }

        .detail-value {
            flex: 1;
            color: #555;
            font-size: 1rem;
        }

        .badge {
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .badge-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .badge-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }

        .badge-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
        }

        .badge-warning {
            background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            color: #212529;
        }

        .badge-info {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
        }

        .quick-actions {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            text-decoration: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            color: white;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            color: white;
        }

        .btn-outline-primary {
            border-color: #667eea;
            color: #667eea;
            background: transparent;
        }

        .btn-outline-primary:hover {
            background: #667eea;
            color: white;
        }

        .btn-outline-secondary {
            border-color: #6c757d;
            color: #6c757d;
            background: transparent;
        }

        .btn-outline-secondary:hover {
            background: #6c757d;
            color: white;
        }

        .btn-outline-info {
            border-color: #17a2b8;
            color: #17a2b8;
            background: transparent;
        }

        .btn-outline-info:hover {
            background: #17a2b8;
            color: white;
        }

        .stats-section {
            margin-top: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .stat-card:hover {
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .stat-content {
            flex: 1;
        }

        .stat-content h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin: 0 0 5px 0;
        }

        .stat-content p {
            color: #666;
            margin: 0;
            font-size: 0.95rem;
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

            .profile-info {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .detail-label {
                flex: none;
                width: 100%;
            }

            .action-buttons {
                justify-content: center;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            .page-title {
                font-size: 2rem;
            }

            .card-body {
                padding: 20px;
            }

            .avatar-circle {
                width: 80px;
                height: 80px;
                font-size: 2rem;
            }

            .stat-card {
                padding: 20px;
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
            }
        }
    `]
})
export class DetailsComponent {
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }

    // Check if current user is an admin
    get isAdmin(): boolean {
        return this.account?.role === 'Admin' || this.account?.role === 'SuperAdmin';
    }
}