export class Stock {
  id?: number;
  itemId!: number;            // ID of the item
  quantity!: number;          // Quantity added or disposed
  price!: number;             // Price per unit
  totalPrice?: number;        // Total price
  locationId!: number;        // Foreign key to StorageLocation
  remarks?: string;           // Optional notes
  disposeId?: number;         // Link to disposal record (null for additions)
  createdAt?: Date;
  createdBy?: number;         // User ID

  // Optional joined data from backend (for display only)
  item?: { id?: number; name: string };
  location?: { id?: number; name: string };
  disposal?: { id?: number; quantity: number; disposalValue: number; reason: string; disposalDate: Date };
}
