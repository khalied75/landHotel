import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "24/7 Open",
    desc: "We never close. Our front desk and services are available around the clock, every day of the year.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Premium Customer Service",
    desc: "Our dedicated team of hospitality experts is here to ensure your stay is perfect in every way.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Luxury Rooms",
    desc: "Choose from our carefully designed rooms and suites, each crafted for maximum comfort and elegance.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Secure & Safe",
    desc: "Your safety is our priority. Enjoy peace of mind with our professional security team on site 24/7.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: "Fine Dining",
    desc: "Savor exquisite meals prepared by world-class chefs using the freshest local and international ingredients.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: "Free Airport Transfer",
    desc: "Start your stay stress-free with our complimentary airport pickup and drop-off service.",
  },
];

export default function Home() {
  return (
    <main className="pt-16">

      {/* Hero Section */}
      <section className="min-h-screen bg-blue-50 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Welcome to Hotel of Land
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl">
          Experience luxury and comfort in the heart of paradise
        </p>
        <Link
          to="/available"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-base transition-colors shadow-md"
        >
          View Rooms
        </Link>
      </section>

      {/* About Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Hotel of Land</h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            Nestled in the heart of New York's vibrant Harlem neighborhood, Hotel of Land is where timeless elegance
            meets modern comfort. Since opening our doors, we have been committed to providing an unforgettable
            experience for every guest — whether you're here for business or leisure. Our hotel blends the rich cultural
            heritage of Harlem with world-class amenities, creating a one-of-a-kind destination you will want to return to.
          </p>
        </div>
      </section>

      {/* Features / Services Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Location</h2>
          <p className="text-gray-500 mb-2 text-base">
            📍 125th Street, Harlem, New York, NY 10027, USA
          </p>
          <p className="text-gray-400 text-sm">
            Minutes away from Central Park, the Apollo Theater, and major subway lines.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Stay?</h2>
        <p className="text-blue-100 mb-8 text-base max-w-xl mx-auto">
          Check available rooms and make a reservation today. Your perfect stay is just a click away.
        </p>
        <Link
          to="/available"
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg text-base transition-colors shadow-md"
        >
          Check Availability
        </Link>
      </section>

    </main>
  );
}
