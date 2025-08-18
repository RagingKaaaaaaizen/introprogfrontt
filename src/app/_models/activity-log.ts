export interface ActivityLog {
    id: number;
    userId: number;
    action: string;
    entityType: string;
    entityId?: number;
    entityName?: string;
    details: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export enum ActivityAction {
    CREATE_ITEM = 'CREATE_ITEM',
    UPDATE_ITEM = 'UPDATE_ITEM',
    DELETE_ITEM = 'DELETE_ITEM',
    ADD_PC_COMPONENT = 'ADD_PC_COMPONENT',
    REMOVE_PC_COMPONENT = 'REMOVE_PC_COMPONENT',
    DISPOSE_ITEM = 'DISPOSE_ITEM',
    ADD_STOCK = 'ADD_STOCK',
    UPDATE_STOCK = 'UPDATE_STOCK',
    CREATE_PC = 'CREATE_PC',
    UPDATE_PC = 'UPDATE_PC',
    CREATE_EMPLOYEE = 'CREATE_EMPLOYEE',
    UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE'
}

export enum EntityType {
    ITEM = 'ITEM',
    PC = 'PC',
    PC_COMPONENT = 'PC_COMPONENT',
    STOCK = 'STOCK',
    DISPOSE = 'DISPOSE',
    EMPLOYEE = 'EMPLOYEE',
    DEPARTMENT = 'DEPARTMENT'
}
