export interface IAddress {
  id: number;
  street: string;
  number: string | null;
  city: string;
  postalCode: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  profilePicture: string | null;
  profilePictureUrl?: string | null;
  address: IAddress | null;
}

export interface IUserForm
  extends Omit<IUser, "id" | "address" | "profilePicture"> {
  address: Omit<IAddress, "id"> | null;
  password: string;
  profilePicture?: File | null;
}

export interface DataPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
