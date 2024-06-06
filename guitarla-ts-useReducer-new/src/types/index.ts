export type Guitar = {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
};

export type CartItem = Guitar & {
  quantity: number;
};

// Option two of inheritance
// export interface CartItem extends Guitar {
//   quantity: number;
// }

// export type GuitarID = Pick<Guitar, "id">;
// the same
export type GuitarID = Guitar["id"];
