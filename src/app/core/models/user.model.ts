export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
  addresses: any[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  skip: number;
  limit: number;
}

export interface UsersResponse {
  data: User[];
  pagination: PaginationInfo;
}
