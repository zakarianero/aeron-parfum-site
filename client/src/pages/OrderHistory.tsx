import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: orders = [], isLoading } = trpc.orders.getMyOrders.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Order History</h1>
          <p className="text-muted-foreground">Please log in to view your orders</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1
              className="text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Order History
            </h1>
            <p className="text-lg text-muted-foreground">
              View all your orders and track their status
            </p>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-secondary/10 rounded-lg p-8">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
              <Button onClick={() => setLocation("/products")}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">
                        {order.totalPrice} DH
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
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
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-border pt-4 mb-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Items ({order.items?.length || 0})
                    </p>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.productName} - {item.size} x {item.quantity}
                          </span>
                          <span className="font-semibold">{item.price} DH</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.shippingAddress && (
                    <div className="border-t border-border pt-4 mb-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        Shipping Address
                      </p>
                      <p className="text-sm">
                        {order.shippingAddress}
                        {order.shippingCity && `, ${order.shippingCity}`}
                        {order.shippingPostalCode && ` ${order.shippingPostalCode}`}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setLocation(`/track-order?orderNumber=${order.orderNumber}`)}
                    >
                      Track Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
