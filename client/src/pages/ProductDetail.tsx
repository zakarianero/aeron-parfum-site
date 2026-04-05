import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

export default function ProductDetail() {
  const params = useParams<{ id?: string }>();
  const id = params?.id || '';
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const productId = parseInt(id || "0", 10);

  // Fetch product details from all categories
  const { data: womensProducts } = trpc.products.byCategory.useQuery(
    { category: "womens" },
    { enabled: true }
  );
  const { data: mensProducts } = trpc.products.byCategory.useQuery(
    { category: "mens" },
    { enabled: true }
  );
  const { data: unisexProducts } = trpc.products.byCategory.useQuery(
    { category: "unisex" },
    { enabled: true }
  );

  const allProducts = [...(womensProducts || []), ...(mensProducts || []), ...(unisexProducts || [])];
  const product = allProducts.find((p) => p.id === productId);

  // Fetch variants using tRPC
  const { data: variants = [] } = trpc.products.variants.useQuery(
    { productId },
    { enabled: productId > 0 }
  );

  useEffect(() => {
    if (variants.length > 0 && !selectedSize) {
      setSelectedSize(variants[0].size);
    }
  }, [variants, selectedSize]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <Button onClick={() => setLocation("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const selectedVariant = variants.find((v) => v.size === (selectedSize || ""));

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a size before adding to cart");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      price: parseFloat(selectedVariant.price),
      quantity,
      imageUrl: product.imageUrl ?? undefined,
    });
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation currentPage="product" />

      {/* Product Detail */}
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setLocation("/products")}
            className="text-accent hover:text-accent/80 mb-8 text-sm font-semibold"
          >
            ← Back to Products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-secondary/10 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground">No image available</div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {/* Fragrance Profile */}
              <div className="bg-secondary/5 rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold">Fragrance Profile</h2>

                {product.scentType && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Scent Type</p>
                    <p className="text-lg">{product.scentType}</p>
                  </div>
                )}

                {product.longevity && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Longevity</p>
                    <p className="text-lg">{product.longevity}</p>
                  </div>
                )}

                {product.season && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Best Season</p>
                    <p className="text-lg">{product.season}</p>
                  </div>
                )}

                {product.occasion && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Occasion</p>
                    <p className="text-lg">{product.occasion}</p>
                  </div>
                )}
              </div>

              {/* Fragrance Notes */}
              <div className="grid grid-cols-3 gap-4">
                {product.topNotes && (
                  <div className="bg-secondary/5 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">TOP NOTES</p>
                    <p className="text-sm">{product.topNotes}</p>
                  </div>
                )}
                {product.heartNotes && (
                  <div className="bg-secondary/5 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">HEART NOTES</p>
                    <p className="text-sm">{product.heartNotes}</p>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="bg-secondary/5 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">BASE NOTES</p>
                    <p className="text-sm">{product.baseNotes}</p>
                  </div>
                )}
              </div>

              {/* Price Display */}
              {selectedVariant && (
                <div className="bg-accent/10 rounded-lg p-6 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Price</p>
                  <p className="text-4xl font-bold text-accent">{selectedVariant.price} DH</p>
                </div>
              )}

              {/* Size Selection */}
              {variants.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold">Select Size:</p>
                  <div className="flex gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`px-6 py-3 rounded font-semibold transition-all ${
                          selectedSize === variant.size
                            ? "bg-accent text-white"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {variant.size} - {variant.price} DH
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {/* Quantity */}
              <div className="space-y-3">
                <p className="font-semibold">Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 bg-secondary/50 rounded font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-2">
                <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded inline-block">
                  🚚 Livraison Gratuite
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-accent hover:bg-accent/90 text-white py-3 text-lg font-bold"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
