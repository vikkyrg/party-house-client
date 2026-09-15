import { motion } from 'framer-motion';

export function OffersPage() {
  return (
    <div className="min-h-screen bg-background pb-24 pt-28">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="eyebrow mb-4">Offers</span>
          <h1 className="text-4xl text-white md:text-5xl">The best seats, the best value.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
            We update our deals often for birthdays, anniversary evenings, and premium group bookings.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-12 rounded-[32px] border border-primary/20 bg-[radial-gradient(circle_at_top,rgba(214,168,79,0.16),transparent_60%),#151518] p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/12 text-primary">
            <span className="text-2xl font-bold">%</span>
          </div>
          <h2 className="text-3xl text-white md:text-4xl">No active offers right now</h2>
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            New seasonal promotions and celebration bundles are coming soon. Check back for exclusive pricing on private screenings and premium rooms.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
