import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = () => {
    if (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone || !checkoutData.address) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Here you would typically send the order to your backend
    console.log("Order submitted:", {
      items,
      totalPrice: getTotalPrice(),
      customerInfo: checkoutData,
    });
    
    alert("Order placed successfully! Thank you for your purchase.");
    clearCart();
    setLocation("/");
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
            <a href="/products" className="hover:text-accent transition-colors duration-300">
              Shop
            </a>
            <span className="font-semibold text-accent">🛒 Cart ({getTotalItems()})</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Shopping Cart
            </h1>
            <p className="text-lg text-muted-foreground">
              Review your selected items and proceed to checkout
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <p className="text-2xl text-muted-foreground">Your cart is empty</p>
              <button
                onClick={() => setLocation("/products")}
                className="px-8 py-3 bg-accent text-white hover:bg-accent/90 transition-all duration-300 rounded"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-secondary/10 px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-bold">Order Items ({getTotalItems()})</h2>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="p-6 hover:bg-secondary/5 transition-colors">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          {item.imageUrl && (
                            <div className="w-24 h-24 bg-secondary/10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Product Details */}
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {item.productName}
                            </h3>
                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                            <p className="text-lg font-semibold text-accent">{item.price} DH</p>
                          </div>

                          {/* Quantity and Remove */}
                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() => removeItem(item.productId, item.size)}
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>

                            <div className="flex items-center gap-2 bg-secondary/20 rounded px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-secondary/50 rounded"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-secondary/50 rounded"
                              >
                                +
                              </button>
                            </div>

                            <p className="text-sm font-semibold">
                              {(item.price * item.quantity).toFixed(2)} DH
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setLocation("/products")}
                  className="w-full px-6 py-3 border border-accent text-accent hover:bg-accent/10 transition-all duration-300 rounded font-semibold"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Order Summary & Checkout */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="border border-border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  
                  <div className="space-y-2 border-b border-border pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-semibold">{getTotalPrice().toFixed(2)} DH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-accent">{getTotalPrice().toFixed(2)} DH</span>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}
                    className="w-full px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-all duration-300 rounded font-semibold"
                  >
                    {isCheckoutOpen ? "Hide Checkout" : "Proceed to Checkout"}
                  </button>
                </div>

                {/* Checkout Form */}
                {isCheckoutOpen && (
                  <div className="border border-border rounded-lg p-6 space-y-4 bg-secondary/5">
                    <h2 className="text-lg font-bold">Delivery Information</h2>

                    <div className="space-y-3">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={checkoutData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={checkoutData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                      />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        value={checkoutData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                      />

                      <textarea
                        name="address"
                        placeholder="Delivery Address *"
                        value={checkoutData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent resize-none"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={checkoutData.city}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                        />

                        <input
                          type="text"
                          name="zipCode"
                          placeholder="Zip Code"
                          value={checkoutData.zipCode}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-all duration-300 rounded font-semibold"
                    >
                      Place Order
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Required fields
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
