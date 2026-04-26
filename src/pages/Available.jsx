import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { push, ref, serverTimestamp } from "firebase/database";
import { auth, db } from "../component/firebase";
import deluxeRoomImage from "../assets/DeluxeRoom.png";
import suiteRoomImage from "../assets/SuiteRoom.png";
import familyRoomImage from "../assets/FamilyRoom.png";

const rooms = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    image: deluxeRoomImage,
    size: "35 m²",
    capacity: "2 Adults",
    price: 120,
    badge: "Popular",
    features: [
      "King Bed",
      "Ocean View",
      "Free WiFi",
      "Breakfast Included",
      "Air Conditioning",
      "Smart TV",
      "Daily Housekeeping",
      "Room Service",
    ],
  },
  {
    id: "suite",
    name: "Suite Room",
    image: suiteRoomImage,
    size: "60 m²",
    capacity: "4 Adults",
    price: 200,
    badge: "Popular",
    features: [
      "2 Bedrooms",
      "Living Area",
      "Balcony",
      "Premium Amenities",
      "Jacuzzi",
      "Mini Bar",
      "Butler Service",
      "City View",
    ],
  },
  {
    id: "family",
    name: "Family Room",
    image: familyRoomImage,
    size: "50 m²",
    capacity: "2 Adults + 2 Kids",
    price: 180,
    badge: "Popular",
    features: [
      "2 Queen Beds",
      "Spacious",
      "Kids Welcome",
      "Mini Bar",
      "Game Console",
      "Sofa Bed",
      "Kitchen Corner",
      "Garden View",
    ],
  },
];

const amenities = [
  {
    title: "Daily Housekeeping",
    desc: "Professional cleaning service twice daily",
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 1.9 4.8L19 9.7l-4.2 2.9 1.4 5-4.2-3.1-4.2 3.1 1.4-5L5 9.7l5.1-1.9L12 3Z" />
        <path d="M19 3v4" />
        <path d="M21 5h-4" />
      </svg>
    ),
  },
  {
    title: "Room Service",
    desc: "24/7 in-room dining available",
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    title: "High-Speed WiFi",
    desc: "Free unlimited internet access",
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <path d="M12 20h.01" />
        <path d="M2 8.82a16 16 0 0 1 20 0" />
      </svg>
    ),
  },
  {
    title: "Climate Control",
    desc: "Individual AC and heating system",
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h13" />
        <path d="M13 5l3 3-3 3" />
        <path d="M21 16H8" />
        <path d="M11 13l-3 3 3 3" />
      </svg>
    ),
  },
];

function getUserDisplayName(user) {
  return user?.displayName?.trim() || user?.email?.split("@")[0] || "";
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Available() {
  const bookingSectionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    roomType: rooms[0].id,
    checkIn: "",
    checkOut: "",
    guests: "1",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setForm((current) => ({
        ...current,
        guestName: getUserDisplayName(currentUser) || current.guestName,
      }));
    });

    return unsubscribe;
  }, []);

  const selectedRoom = rooms.find((room) => room.id === form.roomType) || rooms[0];
  const nights = calculateNights(form.checkIn, form.checkOut);
  const totalPrice = selectedRoom.price * nights;

  const bookingSummary = useMemo(
    () => ({
      roomName: selectedRoom.name,
      roomPrice: selectedRoom.price,
      nights,
      guests: Number(form.guests || 1),
      total: totalPrice,
      image: selectedRoom.image,
    }),
    [form.guests, nights, selectedRoom, totalPrice]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSelectRoom(roomId) {
    setForm((current) => ({
      ...current,
      roomType: roomId,
    }));

    bookingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setError("Please login first to complete your booking.");
      setStatus("");
      return;
    }

    if (!form.guestName.trim() || !form.phone.trim() || !form.checkIn || !form.checkOut) {
      setError("Please complete all required booking fields.");
      setStatus("");
      return;
    }

    if (nights < 1) {
      setError("Check-out date must be after check-in date.");
      setStatus("");
      return;
    }

    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      await push(ref(db, "Bookings"), {
        uid: user.uid,
        guestName: form.guestName.trim(),
        email: user.email || "",
        phone: form.phone.trim(),
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        roomPrice: selectedRoom.price,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        guests: Number(form.guests),
        totalPrice,
        notes: form.notes.trim(),
        createdAt: serverTimestamp(),
      });

      setStatus("Your booking request has been sent successfully.");
      setForm((current) => ({
        ...current,
        checkIn: "",
        checkOut: "",
        guests: "1",
        phone: "",
        notes: "",
      }));
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to send your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 pt-16 text-slate-900">
      <section className="relative overflow-hidden px-4 py-16 text-center text-white sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.95),_transparent_35%),radial-gradient(circle_at_center,_rgba(147,51,234,0.85),_transparent_40%),linear-gradient(135deg,_#2563eb_0%,_#7c3aed_55%,_#c026d3_100%)]" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">Our Luxury Rooms</h1>
          <p className="mt-4 text-lg text-white/90 sm:mt-6 sm:text-xl md:text-3xl">
            Choose from our selection of elegantly designed rooms and suites
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-3">
          {rooms.map((room) => (
            <article key={room.id} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="relative">
                <img src={room.image} alt={room.name} className="h-64 w-full object-cover sm:h-72" />
                <span className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-lg font-semibold text-blue-600 shadow-md">
                  {room.badge}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{room.name}</h2>

                <div className="mt-4 flex flex-wrap items-center gap-5 text-base text-slate-600 sm:text-xl">
                  <div className="flex items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v10" />
                      <path d="M21 10v7" />
                      <path d="M3 12h18" />
                      <path d="M7 12V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4" />
                    </svg>
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{room.capacity}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-blue-600">${room.price}</span>
                  <span className="text-2xl font-semibold text-slate-600">/night</span>
                </div>

                <ul className="mt-8 space-y-3 text-base text-slate-700 sm:text-xl">
                  {room.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f4b400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0">
                        <path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.5 1.09 6.37L12 17.35l-5.72 3 1.09-6.37-4.63-4.5 6.4-.93L12 2.75Z" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSelectRoom(room.id)}
                  className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-xl font-semibold text-white transition hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl md:text-6xl">Room Services & Amenities</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {amenities.map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-blue-600">{item.icon}</div>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-base text-slate-600 sm:text-xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-blue-50 p-6 sm:p-10">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">Hotel Policies</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-8 text-slate-700">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Check-in / Check-out</h3>
                <p className="mt-3 text-lg">Check-in: 2:00 PM | Check-out: 12:00 PM</p>
                <p className="mt-2 text-lg">Early check-in and late check-out available upon request</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Pets Policy</h3>
                <p className="mt-3 text-lg">Small pets allowed (under 10 kg)</p>
                <p className="mt-2 text-lg">Additional fee: $30 per night</p>
              </div>
            </div>
            <div className="space-y-8 text-slate-700">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Cancellation Policy</h3>
                <p className="mt-3 text-lg">Free cancellation up to 48 hours before arrival</p>
                <p className="mt-2 text-lg">No-show charges may apply</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Children Policy</h3>
                <p className="mt-3 text-lg">Children under 12 stay free</p>
                <p className="mt-2 text-lg">Extra bed available for $25 per night</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={bookingSectionRef} className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.55fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8 md:p-10">
            <h2 className="text-3xl font-extrabold sm:text-4xl md:text-6xl">Booking Information</h2>

            {!user && (
              <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-center text-lg text-amber-800 sm:text-2xl">
                Please{" "}
                <Link to="/login" className="font-bold text-blue-600 underline">
                  login
                </Link>{" "}
                to complete your booking
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">{error}</div>
            )}

            {status && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-600">{status}</div>
            )}

            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              <div className="rounded-[1.75rem] bg-blue-50 px-4 py-5 sm:px-5 sm:py-6">
                <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Guest Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={user ? form.guestName : ""}
                  onChange={handleChange}
                  disabled={!user}
                  placeholder={user ? "Enter guest name" : "Please login first"}
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-white sm:px-5 sm:text-xl"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v10" />
                    <path d="M21 10v7" />
                    <path d="M3 12h18" />
                    <path d="M7 12V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4" />
                  </svg>
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - ${room.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Number of Guests
                  </label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xl font-bold text-slate-900 sm:text-2xl">Special Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Optional requests or notes..."
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                />
              </div>

              <button
                type="submit"
                disabled={!user || submitting}
                className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-2xl"
              >
                {!user ? "Please Login First" : submitting ? "Sending Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
              <img src={bookingSummary.image} alt={bookingSummary.roomName} className="h-56 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">Booking Summary</h3>
                <div className="mt-6 space-y-4 text-lg text-slate-600 sm:text-2xl">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <span>Room Type:</span>
                    <span className="text-right font-bold text-slate-800">{bookingSummary.roomName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <span>Price per Night:</span>
                    <span className="font-bold text-blue-600">${bookingSummary.roomPrice}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <span>Number of Nights:</span>
                    <span className="font-bold text-slate-800">{bookingSummary.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <span>Number of Guests:</span>
                    <span className="font-bold text-slate-800">{bookingSummary.guests}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 text-2xl font-extrabold sm:text-4xl">
                  <span>Total Price:</span>
                  <span className="text-blue-600">${bookingSummary.total}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,_#3b82f6_0%,_#8b5cf6_60%,_#a21caf_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
              <h3 className="text-3xl font-extrabold sm:text-4xl">Important Information</h3>
              <ul className="mt-6 space-y-4 text-lg text-white/95 sm:text-2xl">
                <li>✓ Check-in: 2:00 PM</li>
                <li>✓ Check-out: 12:00 PM</li>
                <li>✓ Free cancellation up to 48 hours</li>
                <li>✓ Customer Support: 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
