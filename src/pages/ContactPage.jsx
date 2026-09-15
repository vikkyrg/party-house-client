import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-24 pt-28">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="eyebrow mb-4">Contact</span>
          <h1 className="text-4xl text-white md:text-5xl">Let’s plan your next premiere.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
            We’re here to help with bookings, custom requests, and event planning for your private theater experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <div className="glass-card rounded-[28px] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-2xl text-white">Email us</h3>
              <p className="mt-2 text-text-muted">Our team is here for bookings, support, and custom ideas.</p>
              <a href="mailto:support@cscinemas.com" className="mt-4 inline-block text-primary font-semibold">support@cscinemas.com</a>
            </div>

            <div className="glass-card rounded-[28px] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-2xl text-white">Call us</h3>
              <p className="mt-2 text-text-muted">Mon–Sat, 10:00 AM to 7:00 PM</p>
              <a href="tel:+919876543210" className="mt-4 inline-block text-primary font-semibold">+91 8147 897771</a>
            </div>

            <div className="glass-card rounded-[28px] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-2xl text-white">Visit</h3>
              <p className="mt-2 text-text-muted">
                123 Cinema Road, Koramangala<br />
                Bengaluru, Karnataka 560034
              </p>
            </div>
          </div>

          <div className="glass-card rounded-[30px] p-7 md:p-8">
            <h3 className="text-3xl text-white">Send a message</h3>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-muted">Name</label>
                <input type="text" className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-muted">Email</label>
                <input type="email" className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-muted">Message</label>
                <textarea className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-[#101014] p-4 text-white outline-none transition focus:border-primary/50" placeholder="How can we help?" />
              </div>
              <Button type="submit" className="h-12 w-full text-base font-semibold">Send message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
