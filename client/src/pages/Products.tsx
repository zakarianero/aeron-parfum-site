import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

type Category = "womens" | "mens" | "unisex";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<Category>("womens");

  const { data: products, isLoading } = trpc.products.byCategory.useQuery(
    { category: activeCategory },
    { enabled: true }
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4">
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
          ) : products && products.length > 0 ? (
            products.map((product) => (
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

                  {product.volume && (
                    <p className="text-sm text-muted-foreground">{product.volume}</p>
                  )}

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

                  <div className="space-y-3 pt-4">
                    {product.name === 'Bianco Latte' && (
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded inline-block">
                        🚚 Livraison Gratuite
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-accent">
                        {product.price} DH
                      </span>
                      <button className="px-6 py-2 bg-accent text-white hover:bg-accent/90 transition-all duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
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
  );
}
