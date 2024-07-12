export interface Product {
    id: number;
    name: string;
    detail: string;
    picture: string;
    price: number;
    quantity: number;
    totalPrice: number;
    createdDate: Date;
    editMode?: boolean;
  }
  