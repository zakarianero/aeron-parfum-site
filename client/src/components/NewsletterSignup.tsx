import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
      setName("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await subscribeMutation.mutateAsync({ email, name: name || undefined });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary/10 rounded-lg p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
      <p className="text-muted-foreground mb-6">
        Subscribe to receive exclusive offers and fragrance insights.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:border-accent"
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:border-accent"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="luxury-button w-full"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
