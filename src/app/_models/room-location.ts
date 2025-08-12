export interface RoomLocation {
    id?: number;
    name: string;
    description?: string;
    building?: string;
    floor?: string;
    roomNumber?: string;
    capacity?: number;
    status: 'Active' | 'Inactive' | 'Maintenance';
    createdBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
} 