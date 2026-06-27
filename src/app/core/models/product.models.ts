import { ProductType } from './shared.models';

export interface ProductResponse {
  productId: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  active: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  type: ProductType;
  price: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  active: boolean;
}
