import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

type Category = "womens" | "mens" | "unisex";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<Category>("womens");
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const { data: products, isLoading } = trpc.products.byCategory.useQuery(
    { category: activeCategory },
    { enabled: true }
  );

  // Filter products by search query
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  const handleAddToCart = (product: any, selectedSize: string, selectedVariant: any) => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    if (!selectedVariant) {
      alert("Please select a valid size option");
      return;
    }

    const quantity = quantities[product.id] || 1;
    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      price: parseFloat(selectedVariant.price),
      quantity,
      imageUrl: product.imageUrl || "",
    });

    // Reset quantity after adding
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));

    // Redirect to cart page
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <a
            href="/"
            className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity duration-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            AERON
          </a>
          <div className="flex gap-8 text-sm items-center">
            <a href="/" className="hover:text-accent transition-colors duration-300">
              Home
            </a>
            <a
              href="/products"
              className="hover:text-accent transition-colors duration-300 font-semibold text-accent"
            >
              Shop
            </a>
            <div className="relative">
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-accent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
            </div>
            <button
              onClick={() => setLocation("/cart")}
              className="hover:text-accent transition-colors duration-300 font-semibold"
            >
              🛒 Cart
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1
              className="text-5xl md:text-6xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover AERON PARFUM's exquisite fragrances, carefully curated for those who appreciate luxury.
            </p>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 max-w-2xl mx-auto mt-4">
              <p className="text-sm font-semibold text-accent">📍 Morocco Delivery Only</p>
              <p className="text-xs text-muted-foreground mt-1">
                We currently deliver to Morocco only. Free shipping on all orders.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            <button
              onClick={() => setActiveCategory("womens")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                activeCategory === "womens"
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Women's
            </button>
            <button
              onClick={() => setActiveCategory("mens")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                activeCategory === "mens"
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => setActiveCategory("unisex")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                activeCategory === "unisex"
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Unisex
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedSize={selectedSizes[product.id] || ""}
                  quantity={quantities[product.id] || 1}
                  onSizeSelect={handleSizeSelect}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No products available in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  selectedSize,
  quantity,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
}: {
  product: any;
  selectedSize: string;
  quantity: number;
  onSizeSelect: (productId: number, size: string) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onAddToCart: (product: any, size: string, variant: any) => void;
}) {
  const [, setLocation] = useLocation();
  
  // Fetch variants for this specific product using the hook
  const { data: variants = [], isLoading: variantsLoading } = trpc.products.variants.useQuery(
    { productId: product.id },
    { enabled: !!product.id }
  );

  // Auto-select first size if not already selected
  const effectiveSelectedSize = selectedSize || (variants.length > 0 ? variants[0].size : "");
  const selectedVariant = variants.find((v) => v.size === effectiveSelectedSize);

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:opacity-80" onClick={() => setLocation(`/product/${product.id}`)}>
      {/* Product Image */}
      <div className="mb-6 bg-secondary/10 rounded-lg overflow-hidden aspect-square flex items-center justify-center hover:opacity-80 transition-opacity">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">No image</div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3
          className="text-xl font-bold hover:text-accent transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Size Selection */}
        {variantsLoading ? (
          <p className="text-xs text-muted-foreground">Loading sizes...</p>
        ) : variants.length > 0 ? (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-muted-foreground">Select Size:</p>
            <div className="flex gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => onSizeSelect(product.id, variant.size)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    effectiveSelectedSize === variant.size
                      ? "bg-accent text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No sizes available</p>
        )}

        {/* Quantity Selector */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-muted-foreground">Quantity:</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(product.id, quantity - 1)}
              className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded text-sm"
            >
              −
            </button>
            <span className="px-4 py-1 bg-secondary/50 rounded text-sm font-semibold w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(product.id, quantity + 1)}
              className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-accent/10 rounded-lg p-3 mb-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Price ({effectiveSelectedSize || "Select size"})
          </p>
          <p className="text-3xl font-bold text-accent">
            {selectedVariant ? `${selectedVariant.price} DH` : "—"}
          </p>
        </div>

        {/* Free Delivery */}
        <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded inline-block mb-3">
          🚚 Livraison Gratuite
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product, effectiveSelectedSize, selectedVariant)}
          className="w-full px-6 py-2 bg-accent text-white hover:bg-accent/90 transition-all duration-300 font-semibold rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
