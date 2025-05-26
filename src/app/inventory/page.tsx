import { ProductList } from "./product-list";
import { InventoryHeader } from "./header";

// Dummy data based on the Product model
const products = [
  {
    id: "1",
    name: "Classic White Cotton T-Shirt",
    categoryId: "tops",
    brand: "EssentialWear",
    size: "M",
    cost: 450,
    sell: 899,
    barcode: "890123456789",
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "2",
    name: "High-Waist Slim Fit Jeans",
    categoryId: "bottoms",
    brand: "DenimCo",
    size: "30",
    cost: 1200,
    sell: 2499,
    barcode: "890123456790",
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    categoryId: "dresses",
    brand: "ChicStyle",
    size: "S",
    cost: 1500,
    sell: 2999,
    barcode: "890123456791",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "4",
    name: "Wool Blend Winter Coat",
    categoryId: "outerwear",
    brand: "WinterChic",
    size: "L",
    cost: 3500,
    sell: 6999,
    barcode: "890123456792",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    categoryId: "accessories",
    brand: "LuxeAccessories",
    size: "One Size",
    cost: 1800,
    sell: 3499,
    barcode: "890123456793",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "6",
    name: "Running Shoes - Black",
    categoryId: "footwear",
    brand: "SportFit",
    size: "40",
    cost: 2200,
    sell: 4499,
    barcode: "890123456794",
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "7",
    name: "Yoga Leggings",
    categoryId: "activewear",
    brand: "ActiveLife",
    size: "M",
    cost: 800,
    sell: 1699,
    barcode: "890123456795",
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
  {
    id: "8",
    name: "Silk Evening Gown",
    categoryId: "dresses",
    brand: "LuxuryStyle",
    size: "M",
    cost: 4500,
    sell: 8999,
    barcode: "890123456796",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fm=jpg&q=60&w=3000",
  },
];

export default function Inventory() {
  return (
    <div className="p-6">
      <InventoryHeader />
      <ProductList products={products} />
    </div>
  );
}
