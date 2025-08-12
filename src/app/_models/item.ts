import { Category } from './category';
import { Brand } from './brand';
export interface Item {
  id?: number;
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;           // <-- ADD THIS
  categoryName?: string;
  brandName?: string;     // optional, if API expands
}
