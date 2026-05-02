export type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string | null;
  availabilityStatus?: "available" | "unavailable";
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  description: string | null;
  availabilityStatus: "available" | "unavailable";
  createdAt: string;
};

export type ProductFormPayload = {
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string | null;
  availabilityStatus: "available" | "unavailable";
};
