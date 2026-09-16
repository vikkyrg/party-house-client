import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import {
  MapPin,
  Calendar,
  Star,
  Search,
  ArrowRight,
  ShieldCheck,
  Users,
  Ticket,
  Clock3,
  Gift,
  Camera,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { cityService } from '../services/cityService';

const eventTypes = [
  {
    name: 'Birthdays',
    description: 'Private screenings, cake moments, and a warm room set for the people who matter most.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Anniversaries',
    description: 'A quieter, more intimate celebration with a cinematic glow and a little extra romance.',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Date Night',
    description: 'A premium private screening to turn an evening into a shared memory.',
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Parties',
    description: 'Celebrate birthdays, friends’ nights, and big milestones with room to gather and enjoy.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Private Screenings',
    description: 'A premium viewing room for your guests, your playlist, and your occasion.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
  },
];

const featuredTheaters = [
  {
    name: 'Aurora Luxe Hall',
    location: 'Indiranagar, Bengaluru',
    capacity: '18-30 guests',
    price: '₹2,499',
    amenities: ['4K projector', 'Sound system', 'Decor on request'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Velvet Screen',
    location: 'Lower Parel, Mumbai',
    capacity: '12-22 guests',
    price: '₹3,299',
    amenities: ['Luxury seating', 'Ambient lights', 'Cake setup'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Saffron Room',
    location: 'Gachibowli, Hyderabad',
    capacity: '14-28 guests',
    price: '₹2,899',
    amenities: ['Private entry', 'Audio booth', 'Custom decor'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
];

const addOns = [
  { name: 'Cake', description: 'Celebration-ready cake pairing with custom flavour options.', icon: Gift },
  { name: 'Decor', description: 'Warm lighting, florals, and a thoughtful room setup.', icon: Star },
  { name: 'Bouquet', description: 'Fresh arrangements delivered for the final reveal.', icon: Gift },
  { name: 'Food', description: 'Snacks, platters, and catering for your guest list.', icon: Ticket },
  { name: 'Karaoke', description: 'A playful add-on for birthdays and friend groups.', icon: Users },
  { name: 'Photoshoot', description: 'A curated session to preserve the moment beautifully.', icon: Camera },
  { name: 'Fog entry', description: 'A dramatic entrance for proposals and surprise reveals.', icon: Clock3 },
  { name: 'Guest seating', description: 'Comfort-first layout planning for larger groups.', icon: Users },
];

const faqItems = [
  'Do I need to confirm the exact guest count before booking?',
  'Can I customize the room setup for a birthday or surprise proposal?',
  'What happens after I pay and submit the booking?',
  'Is there a cancellation or reschedule policy?',
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ city: '', date: '' });

  const { data: bannersRes } = useQuery({
    queryKey: ['banners', 'homepage-hero'],
    queryFn: () => contentService.getBanners('homepage-hero'),
  });
  const banners = bannersRes?.data || [];

  const { data: testimonialsRes } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => contentService.getTestimonials(),
  });
  const testimonials = testimonialsRes?.data || [];

  const { data: citiesRes } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityService.getCities(),
  });
  const cities = citiesRes?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.city) params.set('city', searchParams.city);
    if (searchParams.date) params.set('date', searchParams.date);
    navigate(`/theaters?${params.toString()}`);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const revealUp = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const heroBanner = banners[0];

  return (
    <div className="min-h-screen bg-background text-white">
      <SEO title="Home" description="Book private theater celebrations for birthdays, anniversaries, proposals, and memorable evenings." />

      <section className="relative flex min-h-[760px] items-center overflow-hidden pt-24">
        {heroBanner?.image?.url ? (
          <img src={heroBanner.image.url} alt={heroBanner.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2c2a26_0%,#131316_30%,#09090b_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute left-[-8%] top-[14%] h-[440px] w-[440px] rounded-full bg-primary/10 blur-[140px]" />

        <div className="container relative z-10 mx-auto grid items-center gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="eyebrow mb-6">Private theater celebrations</span>
            <h1 className="max-w-xl text-5xl leading-[0.9] text-white md:text-6xl xl:text-[5.4rem]">
              Make the screen part of your celebration.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted md:text-xl">
              Book a private theater for birthdays, anniversaries, date nights, surprise proposals, and unforgettable evenings with friends and family.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 px-7 text-base font-semibold shadow-[0_14px_36px_rgba(214,168,79,0.28)]">
                <Link to="/theaters">Explore theaters</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-7 text-base font-semibold">
                <Link to="/cities">Browse cities</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Trusted planning</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Private group bookings</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="mx-auto w-full max-w-xl">
            <div className="glass-card rounded-[28px] p-5 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-text-muted">Check availability</p>
                  <h2 className="mt-2 text-3xl text-white">Find the right room</h2>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 p-3 text-primary">
                  <Ticket className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-muted">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <select value={searchParams.city} onChange={(e) => setSearchParams((prev) => ({ ...prev, city: e.target.value }))} className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-[#101014] pl-11 pr-4 text-white outline-none transition focus:border-primary/50">
                      <option value="" className="bg-[#101014]">Select a city</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id} className="bg-[#101014]">{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-muted">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={searchParams.date} onChange={(e) => setSearchParams((prev) => ({ ...prev, date: e.target.value }))} className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] pl-11 pr-4 text-white outline-none transition focus:border-primary/50" />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full text-base font-semibold">
                  <Search className="mr-2 h-4 w-4" /> Check availability
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="border-y border-white/5 bg-[#121317] py-16">
        <div className="container mx-auto px-4">
          <motion.div variants={revealUp} className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Choose your celebration</p>
              <h2 className="text-4xl text-white">Moments worth making cinematic.</h2>
            </div>
            <Link to="/events" className="hidden items-center gap-2 text-sm font-medium text-primary md:inline-flex">View all events <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {eventTypes.map((event, index) => (
              <motion.div
                key={event.name}
                variants={revealUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#17181d]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={event.image} alt={event.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-2xl font-semibold text-white">{event.name}</p>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-sm leading-relaxed text-text-muted">{event.description}</p>
                  <Link to="/theaters" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Book this occasion <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={revealUp} className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">Featured theaters</p>
              <h2 className="text-4xl text-white">Spaces designed for your story.</h2>
            </div>
            <Link to="/theaters" className="hidden items-center gap-2 text-sm font-medium text-primary md:inline-flex">Explore all venues <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-3">
            {featuredTheaters.map((theater) => (
              <motion.article
                key={theater.name}
                variants={revealUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#141519] shadow-[0_20px_45px_rgba(0,0,0,0.24)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={theater.image} alt={theater.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Users className="h-3.5 w-3.5 text-primary" /> {theater.capacity}
                  </div>
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-[#111111]">
                    <Star className="h-3.5 w-3.5 fill-[#111111]" /> {theater.rating}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl text-white">{theater.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="h-4 w-4 text-primary" /> {theater.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Starting from</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-semibold text-white">{theater.price}</span>
                        <span className="pb-1 text-sm text-text-muted">/ hour</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {theater.amenities.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-text-muted">{item}</span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link to="/theaters" className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-primary/40 hover:bg-primary/5">View details</Link>
                    <Button asChild className="flex-1 rounded-2xl">
                      <Link to="/theaters">Book now</Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="bg-[#121317] py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div variants={revealUp} className="overflow-hidden rounded-[30px] border border-white/8 bg-[#17181d]">
            <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80" alt="Private theater experience" className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]" />
          </motion.div>

          <motion.div variants={revealUp}>
            <p className="eyebrow mb-4">Inside the experience</p>
            <h2 className="text-4xl text-white">A private room, a shared memory, and a little magic.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-muted">
              From the moment guests walk in, the room is set for the occasion: warm lighting, comfortable seating, sound tuned for emotion, and a booking flow that feels simple and reassuring.
            </p>

            <div className="mt-8 space-y-5">
              {[
                'Choose the right room for your guest count and occasion.',
                'Tell us the date, slot, and the details that matter most.',
                'Add a cake, floral detail, or custom room styling before checkout.',
              ].map((item) => (
                <motion.div key={item} variants={revealUp} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-base text-white/90">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={revealUp} className="mb-8">
            <p className="eyebrow mb-3">Add-ons</p>
            <h2 className="text-4xl text-white">Thoughtful extras that make the moment feel complete.</h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {addOns.map((addon) => {
              const Icon = addon.icon;
              return (
                <motion.div
                  key={addon.name}
                  variants={revealUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[24px] border border-white/8 bg-[#141519] p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-2xl text-white">{addon.name}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{addon.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section id="how-it-works" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="bg-[#121317] py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={revealUp} className="mb-10 text-center">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-4xl text-white">A simple path from idea to celebration.</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: '01', title: 'Discover', text: 'Pick your city, venue, and occasion.' },
              { step: '02', title: 'Personalize', text: 'Choose your date, time, and room add-ons.' },
              { step: '03', title: 'Confirm', text: 'Review the final price and book securely.' },
              { step: '04', title: 'Celebrate', text: 'Arrive and enjoy a room set just for you.' },
            ].map((item) => (
              <motion.div key={item.step} variants={revealUp} whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="relative rounded-[26px] border border-white/8 bg-[#17181d] p-6 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">{item.step}</div>
                <h3 className="text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {cities.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Available cities</p>
                <h2 className="text-4xl text-white">Private celebrations across the city.</h2>
              </div>
              <Link to="/cities" className="hidden items-center gap-2 text-sm font-medium text-primary md:inline-flex">See all cities <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cities.slice(0, 4).map((city) => (
                <Link key={city._id} to={`/theaters?city=${city._id}`} className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[#141519]">
                  <div className="relative h-52">
                    {city.image?.url ? <img src={city.image.url} alt={city.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-[#1d1f23]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-2xl text-white">{city.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-[#121317] py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="eyebrow mb-3">Guest stories</p>
              <h2 className="text-4xl text-white">People book the room for the feeling, not just the screen.</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial._id} className="rounded-[28px] border border-white/8 bg-[#17181d] p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(testimonial.rating || 5)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-text-muted">“{testimonial.content || testimonial.message}”</p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    {testimonial.location && <p className="text-sm text-text-muted">{testimonial.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">FAQ</p>
              <h2 className="text-4xl text-white">Quick answers before you book.</h2>
            </div>
            <Link to="/faq" className="hidden items-center gap-2 text-sm font-medium text-primary md:inline-flex">Read full FAQ <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={item} className="rounded-[20px] border border-white/8 bg-[#141519] px-5 py-4 text-white/90">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{item}</p>
                  <span className="text-primary">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container mx-auto px-4">
          <div className="rounded-[34px] border border-primary/20 bg-[radial-gradient(circle_at_center,rgba(214,168,79,0.12),transparent_35%),#141519] px-6 py-12 text-center md:px-12">
            <p className="eyebrow mb-4">Your next celebration</p>
            <h2 className="mx-auto max-w-3xl text-4xl text-white md:text-5xl">Ready to turn the room into the memory?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">Tell us the date, the occasion, and the kind of evening you want. We’ll help you find the right private theater without the stress.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold">
                <Link to="/theaters">Book now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold">
                <Link to="/contact">Talk to support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
