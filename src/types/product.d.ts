export interface Variant {
  color: string;
  size: string;
  stock: number;
}

export interface Images {
  url: string;
  is_cover: boolean;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  category_id: number;
  subcategory_id?: number;
  variants?: Variant[];
  images?: Images[];
}
