import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

/**
 * AERON PARFUM Landing Page
 * Design Philosophy: Quiet Luxury Minimalism
 * - Extreme whitespace and breathing room
 * - Monochromatic + warm gold accent color
 * - Asymmetric layouts with organic feel
 * - Subtle, smooth interactions
 */

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            AERON
          </a>
          <div className="flex gap-8 text-sm items-center">
            <a href="/products" className="hover:text-accent transition-colors duration-300">
              Shop
            </a>
            <a href="#product" className="hover:text-accent transition-colors duration-300">
              Product
            </a>
            <a href="#about" className="hover:text-accent transition-colors duration-300">
              About
            </a>
            <a href="#contact" className="hover:text-accent transition-colors duration-300">
              Contact
            </a>
            {isAuthenticated && user && (
              <div className="flex gap-4 items-center">
                <span className="text-xs text-muted-foreground">{user.name}</span>
                <button
                  onClick={() => logout()}
                  className="text-xs px-3 py-1 border border-accent text-accent hover:bg-accent hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Image */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/42935f50-2af3-11f1-a72d-114ecf2834b5_0660daac.png"
              alt="AERON PARFUM 30ml"
              className="product-image w-full"
            />
          </div>

          {/* Hero Text - Asymmetric Placement */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="space-y-8">
              <div>
                <p className="text-accent text-sm tracking-widest mb-4" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700 }}>
                  ESSENCE OF LUXURY
                </p>
                <h1 className="text-5xl md:text-6xl leading-tight">
                  Discover the Passion
                </h1>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                AERON PARFUM embodies refined elegance and timeless sophistication. Each 30ml bottle is a testament to the art of perfumery, crafted for those who appreciate the finer things in life.
              </p>

              <div className="pt-4">
                <button className="luxury-button">
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider my-16"></div>

      {/* Product Details Section */}
      <section id="product" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text - Left Side */}
            <div className="space-y-8 order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl">
                Crafted Perfection
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-accent mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Premium Ingredients
                  </h3>
                  <p className="text-muted-foreground">
                    Sourced from the finest suppliers worldwide, our perfume blends rare essences with modern artistry to create an unforgettable olfactory experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-accent mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Elegant Design
                  </h3>
                  <p className="text-muted-foreground">
                    Every detail matters. The crystal bottle, geometric cap, and minimalist label reflect our commitment to understated luxury and timeless beauty.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-accent mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Lasting Impression
                  </h3>
                  <p className="text-muted-foreground">
                    A 30ml bottle of pure sophistication. Long-lasting fragrance that evolves throughout the day, leaving a subtle yet unforgettable trace.
                  </p>
                </div>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="order-1 lg:order-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/42935f50-2af3-11f1-a72d-114ecf2834b5_0660daac.png"
                alt="AERON PARFUM Details"
                className="product-image w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider my-16"></div>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl md:text-5xl mb-6">
              The AERON Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born from a passion for refined aesthetics and the art of perfumery, AERON represents a commitment to excellence. We believe that luxury is not about excess—it's about intention, quality, and the subtle details that make life extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-accent">100%</div>
              <p className="text-muted-foreground">Premium Quality Ingredients</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-accent">30ml</div>
              <p className="text-muted-foreground">Perfect Size for Luxury</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-accent">∞</div>
              <p className="text-muted-foreground">Timeless Elegance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider my-16"></div>

      {/* CTA Section */}
      <section id="contact" className="py-32 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl">
              Experience Luxury
            </h2>
            <p className="text-lg text-muted-foreground">
              Join those who appreciate the finer things. Discover AERON PARFUM and elevate your everyday moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="luxury-button">
                Shop Now
              </button>
              <button className="px-8 py-3 border border-muted hover:border-accent text-foreground hover:text-accent transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="section-divider my-8"></div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-accent mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                AERON
              </h3>
              <p className="text-sm text-muted-foreground">
                Essence of Luxury, Crafted with Intention
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Collection</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Gift Sets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pinterest</a></li>
              </ul>
            </div>
          </div>

          <div className="section-divider mb-8"></div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 AERON PARFUM. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
