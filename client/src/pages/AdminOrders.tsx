import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('pending');

  const { data: orders = [], isLoading, refetch } = trpc.orders.getAllOrders.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedOrderId(null);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Admin Orders</h1>
          <p className="text-muted-foreground">You don't have permission to access this page</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1
              className="text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Orders Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage all customer orders
            </p>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-secondary/10 rounded-lg p-8">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerEmail}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{order.totalPrice} DH</td>
                      <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/track-order?orderNumber=${order.orderNumber}`)}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Status Update Modal */}
          {selectedOrderId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full space-y-4">
                <h2 className="text-2xl font-bold">Update Order Status</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrderId(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      updateStatusMutation.mutate({
                        orderId: selectedOrderId,
                        status: newStatus,
                      });
                    }}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1"
                  >
                    {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
