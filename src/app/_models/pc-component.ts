export enum ComponentStatus {
    Working = 'Working',
    Missing = 'Missing',
    NotWorking = 'Not Working',
    Maintenance = 'Maintenance'
}

export interface PCComponent {
    id?: number;
    pcId: number;
    itemId: number;
    stockId?: number;  // Make optional as it can be null
    quantity: number;
    price: number;
    totalPrice: number;
    status: ComponentStatus;
    remarks?: string;
    createdBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    // Associations
    pc?: any;
    item?: any;
    stock?: any;
    user?: any;
} 