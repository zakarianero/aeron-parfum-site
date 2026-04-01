import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const { data: order, isLoading, error } = trpc.orders.getByNumber.useQuery(
    { orderNumber },
    { enabled: searchSubmitted && !!orderNumber }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearchSubmitted(true);
    }
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
            <a href="/products" className="hover:text-accent transition-colors duration-300">
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
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1
              className="text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Track Your Order
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your order number to check the status
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter order number (e.g., ORD-1234567890-abc123)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button type="submit" className="px-8">
                Search
              </Button>
            </div>
          </form>

          {/* Results */}
          {searchSubmitted && (
            <>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Searching for your order...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-800 rounded-lg p-6 text-center">
                  <p className="font-semibold mb-2">Order Not Found</p>
                  <p className="text-sm mb-4">
                    We couldn't find an order with that number. Please check and try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOrderNumber("");
                      setSearchSubmitted(false);
                    }}
                  >
                    Search Again
                  </Button>
                </div>
              ) : order ? (
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="border border-border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{order.orderNumber}</h2>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-accent">{order.totalPrice} DH</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-bold mb-6">Order Status</h3>
                    <div className="space-y-4">
                      {[
                        { status: 'pending', label: 'Order Pending' },
                        { status: 'processing', label: 'Processing' },
                        { status: 'shipped', label: 'Shipped' },
                        { status: 'delivered', label: 'Delivered' },
                      ].map((step, index) => (
                        <div key={step.status} className="flex items-start gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              ['pending', 'processing', 'shipped', 'delivered'].indexOf(
                                order.status
                              ) >= index
                                ? 'bg-accent text-white'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            ✓
                          </div>
                          <div>
                            <p className="font-semibold">{step.label}</p>
                            {['pending', 'processing', 'shipped', 'delivered'].indexOf(
                              order.status
                            ) === index && (
                              <p className="text-sm text-muted-foreground">
                                Current status
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-bold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between pb-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.size} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">{item.price} DH</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="border border-border rounded-lg p-6">
                      <h3 className="font-bold mb-3">Shipping Address</h3>
                      <p className="text-sm">
                        {order.shippingAddress}
                        {order.shippingCity && <>, {order.shippingCity}</>}
                        {order.shippingPostalCode && <> {order.shippingPostalCode}</>}
                      </p>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-bold mb-3">Contact Information</h3>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Name: </span>
                      {order.customerName}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email: </span>
                      {order.customerEmail}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOrderNumber("");
                        setSearchSubmitted(false);
                      }}
                    >
                      Search Another Order
                    </Button>
                    <Button onClick={() => setLocation("/products")}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
