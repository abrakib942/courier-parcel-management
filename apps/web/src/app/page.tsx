import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AB Logistics</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Fast & Reliable Courier Service</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your parcel, track in real-time, and get delivered on time. Simple, fast, and
            secure.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Book a Parcel</Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline">
                Track Parcel
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Clock />}
                title="Fast Delivery"
                description="Get your parcels delivered quickly and efficiently"
              />
              <FeatureCard
                icon={<MapPin />}
                title="Real-time Tracking"
                description="Track your parcel location in real-time on map"
              />
              <FeatureCard
                icon={<Shield />}
                title="Secure & Safe"
                description="Your parcels are insured and handled with care"
              />
              <FeatureCard
                icon={<Package />}
                title="Easy Booking"
                description="Book parcels in just a few clicks"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Send Your Parcel?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers
          </p>
          <Link href="/register">
            <Button size="lg">Create Account</Button>
          </Link>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 AB Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
