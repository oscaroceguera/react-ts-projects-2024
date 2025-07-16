import { formatCurrency, getImagePath } from "@/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = getImagePath(product.image);
  return (
    <div className="bg-white">
      <Image
        width={500}
        height={500}
        src={imagePath}
        alt={`Imagen platillo ${product.image}`}
      />
      <div className="p-5">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-5 font-black text-4xl text-amber-500">
          {formatCurrency(product.price)}
        </p>
        <AddProductButton product={product} />
      </div>
    </div>
  );
}
