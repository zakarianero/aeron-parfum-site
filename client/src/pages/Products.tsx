import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

type Category = "womens" | "mens" | "unisex";

interface ProductWithVariants {
  product: any;
  variants: any[];
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<Category>("womens");
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [productsWithVariants, setProductsWithVariants] = useState<ProductWithVariants[]>([]);
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const { data: products, isLoading } = trpc.products.byCategory.useQuery(
    { category: activeCategory },
    { enabled: true }
  );

  // Fetch all variants when products change
  useEffect(() => {
    const fetchVariants = async () => {
      if (!products || products.length === 0) {
        setProductsWithVariants([]);
        return;
      }

      try {
        const productsData = await Promise.all(
          products.map(async (product) => {
            try {
              const variantsData = await fetch(`/api/trpc/products.variants?input=${encodeURIComponent(JSON.stringify({ productId: product.id }))}`).then(r => r.json()); const variants = variantsData.result?.data || [];
              return { product, variants };
            } catch (error) {
              console.error(`Failed to fetch variants for product ${product.id}:`, error);
              return { product, variants: [] };
            }
          })
        );
        setProductsWithVariants(productsData);
      } catch (error) {
        console.error("Failed to fetch variants:", error);
        setProductsWithVariants(products.map((p) => ({ product: p, variants: [] })));
      }
    };

    fetchVariants();
  }, [products]);

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
      alert('Please select a size before adding to cart');
      return;
    }
    if (!selectedVariant) {
      alert('Please select a valid size option');
      return;
    }
    
    const quantity = quantities[product.id] || 1;
    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      price: parseFloat(selectedVariant.price),
      quantity,
      imageUrl: product.imageUrl || '',
    });
    
    // Reset quantity after adding
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
    
    // Redirect to cart page
    setLocation('/cart');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            AERON
          </a>
          <div className="flex gap-8 text-sm items-center">
            <a href="/" className="hover:text-accent transition-colors duration-300">
              Home
            </a>
            <a href="/products" className="hover:text-accent transition-colors duration-300 font-semibold text-accent">
              Shop
            </a>
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
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover AERON PARFUM's exquisite fragrances, carefully curated for those who appreciate luxury.
            </p>
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
            ) : productsWithVariants && productsWithVariants.length > 0 ? (
              productsWithVariants.map(({ product, variants }) => {
                const selectedSize = selectedSizes[product.id] || (variants[0]?.size || "");
                const selectedVariant = variants.find((v) => v.size === selectedSize);
                const quantity = quantities[product.id] || 1;

                return (
                  <div
                    key={product.id}
                    className="group cursor-pointer transition-all duration-300 hover:opacity-80"
                  >
                    {/* Product Image */}
                    <div className="mb-6 bg-secondary/10 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
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
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {product.notes && (
                        <p className="text-xs text-accent italic">
                          Notes: {product.notes}
                        </p>
                      )}

                      {/* Size Selection */}
                      {variants.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <p className="text-xs font-semibold text-muted-foreground">Select Size:</p>
                          <div className="flex gap-2">
                            {variants.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => handleSizeSelect(product.id, variant.size)}
                                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                                  selectedSize === variant.size
                                    ? "bg-accent text-white"
                                    : "bg-secondary text-foreground hover:bg-secondary/80"
                                }`}
                              >
                                {variant.size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity Selector */}
                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground">Quantity:</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(product.id, quantity - 1)}
                            className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded text-sm"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 bg-secondary/50 rounded text-sm font-semibold w-12 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, quantity + 1)}
                            className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="bg-accent/10 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Price (50ml)</p>
                        <p className="text-3xl font-bold text-accent">80 DH</p>
                      </div>

                      {/* Free Delivery */}
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded inline-block mb-3">
                        🚚 Livraison Gratuite
                      </div>

                      {/* Size and CTA */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {selectedVariant ? `Selected: ${selectedVariant.size}` : "Select size"}
                          </span>
                          <button 
                            onClick={() => handleAddToCart(product, selectedSize, selectedVariant)}
                            className="px-6 py-2 bg-accent text-white hover:bg-accent/90 transition-all duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products available in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
