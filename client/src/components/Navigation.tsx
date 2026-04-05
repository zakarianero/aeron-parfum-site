import { useLocation } from "wouter";
import { useState } from "react";

interface NavigationProps {
  currentPage?: "home" | "shop" | "product" | "about" | "contact";
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    // Navigate to products page with search query as URL parameter
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
      // Clear the search input after navigation
      setSearchQuery("");
    } else {
      setLocation("/products");
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
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
            className={`hover:text-accent transition-colors duration-300 ${
              currentPage === "shop" ? "font-semibold text-accent" : ""
            }`}
          >
            Shop
          </a>
          <a href="/about" className="hover:text-accent transition-colors duration-300">
            About
          </a>
          <a href="/contact" className="hover:text-accent transition-colors duration-300">
            Contact
          </a>

          {/* Search Icon - visible on all pages */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-accent w-32"
              autoComplete="off"
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors text-xs font-semibold"
            >
              Search
            </button>
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
  );
}
