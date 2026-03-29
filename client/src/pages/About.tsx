import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition-opacity duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>AERON</a>
          <div className="flex gap-8 text-sm items-center">
            <a href="/" className="hover:text-accent transition-colors duration-300">Home</a>
            <a href="/products" className="hover:text-accent transition-colors duration-300">Shop</a>
            <a href="/about" className="hover:text-accent transition-colors duration-300 font-semibold text-accent">About</a>
            <button onClick={() => setLocation("/cart")} className="hover:text-accent transition-colors duration-300">Cart</button>
          </div>
        </div>
      </nav>
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>About AERON</h1>
            <p className="text-lg text-muted-foreground">Discover the story behind our luxury fragrances</p>
          </div>
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">At AERON PARFUM, we believe that luxury is not about excess—it's about intention, quality, and the subtle details that make life extraordinary. Born from a passion for refined aesthetics and the art of perfumery, we are committed to creating fragrances that elevate everyday moments.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">Our Craft</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Every AERON fragrance is meticulously crafted using premium ingredients sourced from the finest suppliers worldwide. Our master perfumers blend rare essences with modern artistry to create unforgettable olfactory experiences that stand the test of time.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/5 rounded-lg p-6 space-y-3">
                  <h3 className="text-xl font-bold text-accent">Quality</h3>
                  <p className="text-muted-foreground">We use only 100% premium quality ingredients in every bottle.</p>
                </div>
                <div className="bg-secondary/5 rounded-lg p-6 space-y-3">
                  <h3 className="text-xl font-bold text-accent">Elegance</h3>
                  <p className="text-muted-foreground">Every detail reflects our commitment to timeless beauty.</p>
                </div>
                <div className="bg-secondary/5 rounded-lg p-6 space-y-3">
                  <h3 className="text-xl font-bold text-accent">Longevity</h3>
                  <p className="text-muted-foreground">Our fragrances leave a lasting impression throughout the day.</p>
                </div>
              </div>
            </section>
          </div>
          <div className="text-center pt-8">
            <button onClick={() => setLocation("/products")} className="px-8 py-3 bg-accent text-white hover:bg-accent/90 transition-all duration-300 font-semibold">Explore Our Collection</button>
          </div>
        </div>
      </div>
    </div>
  );
}
