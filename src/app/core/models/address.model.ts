export interface Address {
  _id?: string;
  id?: string;
  title: string;
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  title: string;
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
