import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { push, ref, serverTimestamp } from "firebase/database";
import { auth, db } from "../component/firebase";

const contactCards = [
  {
    title: "Phone",
    lines: ["+1 (555) 123-4567", "Toll-free: 1-800-HOTEL-01"],
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z" />
      </svg>
    ),
  },
  {
    title: "Email",
    lines: ["info@hotelofland.com", "reservations@hotelofland.com"],
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    title: "Address",
    lines: ["123 Paradise Avenue", "Coastal City, CC 12345"],
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Working Hours",
    lines: ["Reception: 24/7", "Support: 8 AM - 10 PM"],
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

const departments = [
  {
    title: "Reservations",
    phone: "+1 (555) 123-4501",
    email: "reservations@hotelofland.com",
  },
  {
    title: "Guest Services",
    phone: "+1 (555) 123-4502",
    email: "guestservices@hotelofland.com",
  },
  {
    title: "Events & Conferences",
    phone: "+1 (555) 123-4503",
    email: "events@hotelofland.com",
  },
  {
    title: "Restaurant",
    phone: "+1 (555) 123-4504",
    email: "restaurant@hotelofland.com",
  },
];

function getUserFirstName(user) {
  return user?.displayName?.trim()?.split(" ")[0] || "";
}

function getUserLastName(user) {
  const parts = user?.displayName?.trim()?.split(" ") || [];
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

export default function Contact() {
  const [user, setUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setForm((current) => ({
        ...current,
        firstName: current.firstName || getUserFirstName(currentUser),
        lastName: current.lastName || getUserLastName(currentUser),
        email: current.email || currentUser?.email || "",
      }));
    });

    return unsubscribe;
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("Please fill in all fields before sending your message.");
      setStatus("");
      return;
    }

    setSending(true);
    setError("");
    setStatus("");

    try {
      await push(ref(db, "Message"), {
        uid: user?.uid || "",
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });

      setStatus("Your message has been sent successfully.");
      setForm((current) => ({
        ...current,
        phone: "",
        subject: "General Inquiry",
        message: "",
      }));
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="bg-slate-50 pt-16 text-slate-900">
      <section className="relative overflow-hidden px-4 py-16 text-center text-white sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.95),_transparent_35%),radial-gradient(circle_at_center,_rgba(147,51,234,0.85),_transparent_40%),linear-gradient(135deg,_#2563eb_0%,_#7c3aed_55%,_#c026d3_100%)]" />
        <div className="relative mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">Contact Us</h1>
          <p className="mt-4 text-lg text-white/90 sm:mt-6 sm:text-xl md:text-3xl">We&apos;re here to help and answer any questions you might have</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => (
            <article key={card.title} className="rounded-[2rem] bg-white p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20 ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-slate-900 sm:mt-8 sm:text-3xl">{card.title}</h2>
              <div className="mt-4 space-y-2 text-base text-slate-600 sm:text-xl">
                {card.lines.map((line) => (
                  <p key={line} className="break-words">{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8 md:p-12">
            <h2 className="text-3xl font-extrabold sm:text-4xl md:text-6xl">Send us a Message</h2>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">{error}</div>
            )}

            {status && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-600">{status}</div>
            )}

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
                />
              </div>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
              />

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
              />

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
              >
                <option>General Inquiry</option>
                <option>Reservations</option>
                <option>Guest Services</option>
                <option>Events & Conferences</option>
                <option>Restaurant</option>
              </select>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={7}
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-5 sm:text-xl"
              />

              <button
                type="submit"
                disabled={sending}
                className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:text-2xl"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8 md:p-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Departments</h2>
              <div className="mt-8 divide-y divide-slate-200">
                {departments.map((department) => (
                  <div key={department.title} className="py-6 first:pt-0 last:pb-0">
                    <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{department.title}</h3>
                    <div className="mt-4 space-y-3 text-base text-slate-600 sm:text-xl">
                      <div className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z" />
                        </svg>
                        <span className="break-words">{department.phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                        <span className="break-all">{department.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,_#3b82f6_0%,_#8b5cf6_60%,_#a21caf_100%)] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8 md:p-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Need Immediate Assistance?</h2>
              <p className="mt-4 text-base text-white/90 sm:mt-5 sm:text-xl">
                Our 24/7 customer support team is always ready to help you
              </p>

              <a
                href="tel:+15551234567"
                className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-lg font-medium text-blue-600 transition hover:bg-blue-50 sm:mt-8 sm:flex-row sm:px-6 sm:text-2xl"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1v-8h1a2 2 0 0 1 2 2Z" />
                  <path d="M3 19a2 2 0 0 0 2 2h1v-8H5a2 2 0 0 0-2 2Z" />
                </svg>
                <span className="break-words">Call Now: +1 (555) 123-4567</span>
              </a>

              <a
                href="mailto:info@hotelofland.com"
                className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-lg font-medium text-blue-600 transition hover:bg-blue-50 sm:flex-row sm:px-6 sm:text-2xl"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <span className="break-all">Email Support: info@hotelofland.com</span>
              </a>
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8 md:p-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Follow Us</h2>
              <div className="mt-6 flex flex-wrap gap-4 sm:mt-8 sm:gap-5">
                {["bg-blue-600", "bg-sky-500", "bg-pink-600", "bg-red-600"].map((color, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white transition hover:-translate-y-1 sm:h-16 sm:w-16 ${color}`}
                    aria-label="Social link"
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18" />
                      <path d="M12 3a15 15 0 0 1 0 18" />
                      <path d="M12 3a15 15 0 0 0 0 18" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
