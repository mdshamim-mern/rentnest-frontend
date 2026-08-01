export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  bio?: string;
  photo?: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rentType?: string;
  rentNegotiable?: boolean;
  floorArea?: number;
  rentFor?: string[];
  bedrooms?: number;
  bathrooms?: number;
  balcony?: number;
  floorLevel?: string;
  gas?: string;
  parking?: string;
  lift?: string;
  furnished?: string;
  facing?: string;
  serviceCharge?: number;
  availableFrom?: string;
  amenities?: string[];
  videoLink?: string;
  newBuild?: string;
  propertyType?: string;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  category?: Category;
  landlord?: User;
  image?: string;
  images?: string[];
  isAvailable?: boolean;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  createdAt: string;
  property?: Property;
  tenant?: User;
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalRequestId: string;
  amount: number;
  status: string;
  paidAt: string;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  tenantId: string;
  propertyId: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorDetails?: any;
}