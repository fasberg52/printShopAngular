export enum DeliveryMethod {
  POST = 'post',
  PICKUP = 'pickup',
  EXPRESS = 'express',
}

export interface DeliveryMethodModel {
  method: DeliveryMethod;
  name: string;
  basePrice: number;
  description?: string;
  isActive: boolean;
  requiresAddress: boolean;
}

export interface CreateDeliveryMethodDto {
  method: DeliveryMethod;
  name: string;
  basePrice: number;
  description?: string;
  isActive?: boolean;
  requiresAddress?: boolean;
}

export interface UpdateDeliveryMethodDto
  extends Partial<CreateDeliveryMethodDto> {}
