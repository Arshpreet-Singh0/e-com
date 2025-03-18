export interface Product {
    id: string
    name: string;
    price: number;
    images: string[];
    colors: string[];
    sizes : {
      size: string;
      quantity : number
    }[];
    discount? : number;
    description? : string;
    category : string;
    stock : number;
    tags : string[]
  }