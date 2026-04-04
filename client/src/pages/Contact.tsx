import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage="contact" />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Get in Touch</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          {submitted ? (
            <div className="bg-green-100 border border-green-300 rounded-lg p-6 text-center space-y-3">
              <p className="text-green-800 font-semibold text-lg">Thank you for your message!</p>
              <p className="text-green-700">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-secondary/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-secondary/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-semibold">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 bg-secondary/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-2 bg-secondary/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Your message here..." />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white py-3 font-semibold">Send Message</Button>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="bg-secondary/5 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-bold">Email</h3>
              <p className="text-muted-foreground">contact@aeronparfum.com</p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-bold">Hours</h3>
              <p className="text-muted-foreground">Mon - Fri: 9AM - 6PM<br />Sat - Sun: 10AM - 4PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
