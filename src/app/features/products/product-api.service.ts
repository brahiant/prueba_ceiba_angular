import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../core/api/api-client.service';
import { CreateProductRequest, ProductResponse, UpdateProductRequest } from '../../core/models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly apiClient = inject(ApiClientService);

  list(): Observable<ProductResponse[]> {
    return this.apiClient.get<ProductResponse[]>('/products');
  }

  getById(productId: string): Observable<ProductResponse> {
    return this.apiClient.get<ProductResponse>(`/products/${productId}`);
  }

  create(request: CreateProductRequest): Observable<ProductResponse> {
    return this.apiClient.post<ProductResponse, CreateProductRequest>('/products', request);
  }

  update(productId: string, request: UpdateProductRequest): Observable<ProductResponse> {
    return this.apiClient.put<ProductResponse, UpdateProductRequest>(`/products/${productId}`, request);
  }
}
