export interface Dispose {
    id?: number;
    itemId: number;
    locationId: number;
    quantity: number;
    disposalValue: number;
    totalValue?: number;
    disposalDate: Date;
    reason: string;
    remarks?: string;
    createdBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    // Associations
    item?: any;
    user?: any;
    location?: any;
} 