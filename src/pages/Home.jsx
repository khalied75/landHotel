import { Link } from "react-router-dom";

const amenities = [
  {
    title: "Free WiFi",
    desc: "High-speed internet",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <path d="M12 20h.01" />
        <path d="M2 8.82a16 16 0 0 1 20 0" />
      </svg>
    ),
  },
  {
    title: "Breakfast",
    desc: "Complimentary daily",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M12 2v4" />
        <path d="M16 2v4" />
        <path d="M7 8h8a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4H7Z" />
        <path d="M7 8v12" />
        <path d="M7 20h8" />
        <path d="M19 10h1a2 2 0 0 1 0 4h-1" />
      </svg>
    ),
  },
  {
    title: "Free Parking",
    desc: "Secure parking lot",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9" />
        <path d="M15 6H6v11" />
        <path d="M2 12h3" />
        <path d="M7 16H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h3l2-5h7l3 5h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="17.5" cy="16.5" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Fitness Center",
    desc: "24/7 access",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5 17.5 17.5" />
        <path d="M21 21l-1.5-1.5" />
        <path d="M3 3l1.5 1.5" />
        <path d="M18 22l4-4" />
        <path d="M2 6l4-4" />
        <path d="M3.5 9.5 9.5 3.5" />
        <path d="M14.5 20.5l6-6" />
        <path d="m8 12 4 4" />
      </svg>
    ),
  },
  {
    title: "Restaurant",
    desc: "Fine dining",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3v7" />
        <path d="M7 3v7" />
        <path d="M5.5 10v11" />
        <path d="M17 3c-1.7 2-2.5 4.33-2.5 7v11" />
        <path d="M20 3v18" />
      </svg>
    ),
  },
  {
    title: "Security",
    desc: "24/7 surveillance",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 5-3.5 8.74-7 10-3.5-1.26-7-5-7-10V6l7-3Z" />
      </svg>
    ),
  },
  {
    title: "Reception",
    desc: "Always available",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Premium Service",
    desc: "Award-winning staff",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="m8 14-1 7 5-3 5 3-1-7" />
      </svg>
    ),
  },
];

const stats = [
  { value: "50+", label: "Luxury Rooms" },
  { value: "10K+", label: "Happy Guests" },
  { value: "25+", label: "Years Experience" },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white pt-16 text-slate-900">
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-900 px-6 py-20 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.95),_transparent_35%),radial-gradient(circle_at_center,_rgba(147,51,234,0.85),_transparent_40%),linear-gradient(135deg,_#1d4ed8_0%,_#7e22ce_55%,_#db2777_100%)]" />
        <div className="absolute inset-x-0 bottom-[-18%] mx-auto h-72 w-72 rounded-full bg-white/10 blur-3xl md:h-96 md:w-96" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center">
          <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight md:text-7xl">
            Welcome to Hotel of Land
          </h1>
          <p className="mt-6 max-w-4xl text-xl font-medium text-white/90 md:text-3xl">
            Experience luxury and comfort in the heart of paradise
          </p>
          <p className="mt-5 max-w-3xl text-base text-white/80 md:text-xl">
            Your perfect stay awaits with world-class amenities and exceptional service
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/available"
              className="min-w-[190px] rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              View Rooms
            </Link>
            <Link
              to="/contact"
              className="min-w-[190px] rounded-2xl border border-white/80 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              Our Premium Amenities
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-2xl">
              Enjoy world-class facilities and services designed to make your stay memorable and comfortable
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((item) => (
              <article key={item.title} className="flex flex-col items-center px-6 text-center">
                <div className="text-blue-600">{item.icon}</div>
                <h3 className="mt-8 text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-lg text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              About Hotel of Land
            </h2>
            <div className="mt-8 space-y-7 text-lg leading-10 text-slate-700 md:text-[2rem] md:leading-[3.5rem] lg:text-[1.1rem] lg:leading-10">
              <p>
                Hotel of Land is a premier luxury hotel offering exceptional hospitality since 2000. Located in the heart
                of the city, we provide our guests with an unforgettable experience combining comfort, elegance, and
                world-class service.
              </p>
              <p>
                Our dedicated team is committed to ensuring every guest enjoys personalized attention and all the
                amenities needed for a perfect stay. Whether you&apos;re here for business or leisure, we guarantee an
                experience that exceeds expectations.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left">
              {stats.map((item) => (
                <div key={item.label}>
                  <div className="text-4xl font-extrabold text-blue-600 md:text-5xl">{item.value}</div>
                  <p className="mt-2 text-lg text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-sky-300 via-blue-500 to-blue-600 shadow-[0_24px_60px_rgba(15,23,42,0.12)]" />
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-violet-300 via-fuchsia-400 to-purple-500 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:translate-y-10" />
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-pink-300 via-pink-500 to-fuchsia-500 shadow-[0_24px_60px_rgba(15,23,42,0.12)]" />
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-amber-300 via-yellow-400 to-yellow-500 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:translate-y-10" />
          </div>
        </div>
      </section>
    </main>
  );
}
