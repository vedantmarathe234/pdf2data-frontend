import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineDatabase,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineCheck,
  HiBadgeCheck,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineClipboardList,
  HiOutlineReceiptTax,
  HiOutlineDocumentReport,
  HiOutlineIdentification,
  HiOutlineTable,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineArrowRight,
  HiOutlineChat,
  HiPaperAirplane,
  HiStar,
  HiOutlineStar,
  HiMenu,
  HiX,
  HiHeart,
} from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import logo from "../assets/pdf2data.png";
import { getCurrentUser } from "../services/auth";

// Swap these for your own hosted assets whenever you have them —
// they're just placeholders so the sections aren't empty.
// Hero now rotates through a few professional "person at work" shots
// instead of a single static image.
const heroImages = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
];
const newsletterImage =
  "https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?q=80&w=1200&auto=format&fit=crop";

const documentTypes = [
  {
    name: "Invoices",
    desc: "Line items, totals, vendor and tax fields.",
    icon: HiOutlineReceiptTax,
    image: "https://images.unsplash.com/photo-1495364037436-fed1ba81ad3e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Bank statements",
    desc: "Transactions, balances, statement periods.",
    icon: HiOutlineDocumentReport,
    image: "https://images.unsplash.com/photo-1772588627527-db42040f3a8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Contracts",
    desc: "Clauses, parties, dates and key terms.",
    icon: HiOutlineClipboardList,
    image: "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "ID documents",
    desc: "Names, numbers and expiry fields.",
    icon: HiOutlineIdentification,
    image: "https://images.unsplash.com/photo-1758611972678-bc3b29b4718f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Forms",
    desc: "Checkboxes, key-value pairs, signatures.",
    icon: HiOutlineDocumentText,
    image: "https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Custom tables",
    desc: "Any tabular layout, mapped to columns.",
    icon: HiOutlineTable,
    image: "https://images.unsplash.com/photo-1758518729908-d4220a678d81?q=80&w=600&auto=format&fit=crop",
  },
];

const formats = [
  {
    name: "JSON",
    tag: "Most popular",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    sample: ["{", '  "total": "1,533.60"', "}"],
  },
  {
    name: "CSV",
    tag: "Spreadsheet ready",
    badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    sample: ["item,qty,total", "Freight,1,1950", "Labels,500,3200"],
  },
  {
    name: "Excel (.xlsx)",
    tag: "Finance teams",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    sample: ["| Item | Total |", "| Freight | 1,950 |"],
  },
  {
    name: "SQL",
    tag: "Direct to database",
    badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    sample: ["INSERT INTO invoices", "VALUES ('INV-08234', ...);"],
  },
];

const trustBadges = [
  { icon: HiOutlineLightningBolt, title: "Instant extraction", desc: "Most documents finish in under 5 seconds." },
  { icon: HiOutlineCheck, title: "Human-grade accuracy", desc: "99%+ field accuracy, checked against layout." },
  { icon: HiOutlineDatabase, title: "Any export format", desc: "JSON, CSV, Excel or SQL — your choice." },
  { icon: HiOutlineShieldCheck, title: "Secure by default", desc: "Documents are deleted after processing." },
];

const chatMessages = [
  { from: "user", text: "What's the total on this invoice?" },
  { from: "bot", text: "The total is ₹42,180.00, billed by Northwind Supply Co. on 14 Aug 2026." },
  { from: "user", text: "Was tax included in that?" },
  { from: "bot", text: "Yes — ₹3,780.00 of that is GST, charged at 9.8% on the line items." },
];

// Static testimonials — a fixed set so the section always has enough
// content to auto-scroll through, independent of what real users submit.
// Ratings are intentionally mixed (mostly 4–5, a couple of honest 3s)
// so the wall doesn't look like every review was hand-picked.
// Most reviews carry a profile photo; two (Rahul Verma, Ananya Joshi)
// intentionally have no `image` field so they fall back to the
// gradient-initials avatar — keeps the wall from looking too uniform.
// NOTE: swap these Unsplash placeholder photos for real customer photos
// when you have them — they're generic stock portraits, not verified
// to be the actual people.
const staticReviews = [
  {
    name: "Riya Kulkarni",
    role: "Finance operations lead, Meridian Retail",
    rating: 5,
    text: "We processed three years of vendor invoices in a weekend. What used to be a full-time data-entry role is now a folder someone drags files into.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Aditya Deshmukh",
    role: "Founder, Deshmukh & Co. Accountants",
    rating: 4,
    text: "Handles messy scanned statements better than I expected. Occasionally a footer note gets picked up as a line item, but the export saves us hours every week.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Sneha Patil",
    role: "Ops manager, Kirana Logistics",
    rating: 5,
    text: "Uploaded a stack of transport contracts and had clause-level fields back in CSV before my coffee got cold. The SQL export plugged straight into our warehouse.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Rahul Verma",
    role: "Accounts payable, Verma Textiles",
    rating: 3,
    text: "Works well on clean digital invoices. Older faxed and photocopied ones need a manual check afterwards, so it's not fully hands-off for us yet.",
  },
  {
    name: "Priya Nair",
    role: "Compliance analyst, Nair Financial Services",
    rating: 5,
    text: "The document chat feature is what sold our team. Being able to just ask 'what's the GST on this' instead of hunting through a spreadsheet is a genuine time-saver.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Karan Mehta",
    role: "Co-founder, Mehta Freight Solutions",
    rating: 4,
    text: "Accuracy on bank statements has been consistently solid across different bank formats. Support was quick to respond when we had a formatting question.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Ananya Joshi",
    role: "HR & admin lead, Joshi Manufacturing",
    rating: 3,
    text: "Does the job for ID documents and forms. The UI could use a bit more polish, but the extraction itself has never been wrong on the fields we care about.",
  },
  {
    name: "Vikram Rao",
    role: "CFO, Rao Building Materials",
    rating: 5,
    text: "We moved our entire invoice reconciliation workflow onto pdf2data. What surprised me most was how well it handled our vendors' inconsistent layouts.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Meera Iyer",
    role: "Bookkeeper, Iyer & Associates",
    rating: 4,
    text: "Excel export keeps our existing templates intact, which made adoption painless for the rest of the team. Genuinely useful, day to day tool now.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
];

// Gradient initials avatar — matches the app's sidebar accent
function InitialsAvatar({ name, size = 40 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shrink-0"
    >
      <span style={{ fontSize: size * 0.4 }}>{initial}</span>
    </div>
  );
}

// Single review card used inside the auto-scrolling row.
// Fixed width + shrink-0 so the horizontal marquee keeps a consistent
// card size no matter how long each review's text is.
function ReviewCard({ r, keyPrefix }) {
  return (
    <div
      key={keyPrefix}
      className="w-[260px] sm:w-[300px] shrink-0 bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex gap-1 text-amber-400 mb-3">
        {Array.from({ length: 5 }).map((_, s) => (
          <HiStar key={s} size={14} className={s < r.rating ? "" : "text-slate-200 dark:text-indigo-900"} />
        ))}
      </div>
      <p
        className="text-sm text-slate-700 dark:text-indigo-200/90 leading-relaxed mb-4"
        style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {r.text}
      </p>
      <div className="flex items-center gap-3">
        {r.image ? (
          <img src={r.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-purple-100 dark:border-purple-900/40" />
        ) : (
          <InitialsAvatar name={r.name} size={40} />
        )}
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            {r.name}
            {r.email && (
              <HiBadgeCheck size={15} className="text-purple-600 dark:text-purple-400" title="Verified user" />
            )}
          </p>
          <p className="text-xs text-slate-500 dark:text-indigo-300/70">{r.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---- Logged-in user  ----
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // ---- Hero image carousel ----
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // ---- Reviews ----
  // Static reviews always show; anything a logged-in user posts is added
  // on top of that list so the scrolling wall never looks empty.
  const REVIEWS_STORAGE_KEY = "pdf2data_user_reviews";
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewError, setReviewError] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(userReviews));
    } catch {
      // storage full or unavailable — reviews will still work for this session
    }
  }, [userReviews]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      setReviewError("Please log in to leave a review.");
      return;
    }
    if (!reviewText.trim() || reviewRating === 0) {
      setReviewError("Please add a rating and a short review.");
      return;
    }
    setReviewError("");
    const newReview = {
      name: currentUser.username,
      email: currentUser.email,
      role: "Verified user",
      rating: reviewRating,
      text: reviewText.trim(),
    };
    setUserReviews((prev) => {
      // one review per account — editing replaces their previous review
      const withoutMine = prev.filter((r) => r.email !== currentUser.email);
      return [newReview, ...withoutMine];
    });
    setReviewText("");
    setReviewRating(0);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  }

  // Real user reviews on top, static ones after, duplicated once so the
  // horizontal marquee loops seamlessly without a visible jump.
  const allReviews = [...userReviews, ...staticReviews];
  const marqueeReviews = [...allReviews, ...allReviews];

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#0b0b14] text-slate-900 dark:text-white font-sans transition-colors duration-200 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Keyframes for the horizontal review marquee. Plain <style> tag so it
          works in this file without any extra build config. */}
      <style>{`
        @keyframes reviewsScrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .reviews-marquee {
          animation: reviewsScrollX 45s linear infinite;
          width: max-content;
        }
        .reviews-marquee-pause:hover .reviews-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* ---------- HEADER ---------- */}
      <header className="absolute top-0 left-0 z-50 w-full bg-transparent transition-colors">
        <div className="w-full px-4 sm:px-8 md:px-14 lg:px-20 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="PDF2DATA Logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform hover:scale-105 drop-shadow-md"
            />
          </Link>

          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            <div
              onClick={() => setDark((prev) => !prev)}
              className="relative flex items-center w-[54px] sm:w-[58px] md:w-[64px] h-[28px] sm:h-[30px] md:h-[34px] rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 p-1 cursor-pointer transition-colors"
              title="Toggle Theme"
            >
              <div
                className={`absolute top-1 h-[18px] sm:h-[20px] md:h-[24px] w-[18px] sm:w-[20px] md:w-[24px] rounded-full bg-white dark:bg-purple-600 shadow-sm transition-transform duration-200 ${
                  dark ? "translate-x-[24px] sm:translate-x-[26px] md:translate-x-[30px]" : "translate-x-0"
                }`}
              />
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineSun size={14} className={!dark ? "text-slate-900 font-bold" : "text-white/60"} />
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineMoon size={14} className={dark ? "text-white font-bold" : "text-white/80"} />
              </div>
            </div>

            <Link
              to="/login"
              className="text-xs md:text-sm font-semibold text-slate-800 dark:text-white drop-shadow-md hover:opacity-80 transition px-3 md:px-4 py-2 rounded-xl hover:bg-white/15 dark:hover:bg-white/10"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm cursor-pointer"
            >
              Get Started
            </Link>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <div
              onClick={() => setDark((prev) => !prev)}
              className="relative flex items-center w-12 h-7 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 p-0.5 cursor-pointer"
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white dark:bg-purple-600 shadow-sm transition-transform duration-200 ${
                  dark ? "translate-x-5" : "translate-x-0"
                }`}
              />
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineSun size={12} className={!dark ? "text-slate-900" : "text-white/50"} />
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineMoon size={12} className={dark ? "text-white" : "text-white/80"} />
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 dark:text-white drop-shadow-md hover:bg-white/15 dark:hover:bg-white/10 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-5 space-y-2.5 bg-white/90 dark:bg-[#121222]/90 backdrop-blur-md border-b border-white/20 dark:border-indigo-950">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-[#18182f] text-slate-800 dark:text-indigo-200"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-xs font-bold rounded-xl bg-purple-600 text-white shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden">
        {/* Rotating full-bleed background images — focal point kept on the right */}
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Professional working on a laptop, extracting document data"
            className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-[1800ms] ease-in-out ${
              i === heroIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ transitionProperty: "opacity, transform", transitionDuration: "1800ms, 6000ms" }}
          />
        ))}

        {/* Left-to-right dark gradient so the text stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 dark:from-[#0b0b14] dark:via-[#0b0b14]/85 dark:to-[#0b0b14]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40" />

        {/* progress dots */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-1.5 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              aria-label={`Show hero image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIndex ? "w-5 bg-purple-600" : "w-1.5 bg-slate-400/60 hover:bg-slate-500/80"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-14 lg:px-20">
          <div className="max-w-2xl space-y-5 sm:space-y-6 text-center lg:text-left mx-auto lg:mx-0">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-4 py-2 rounded-full">
              AI-powered PDF extraction
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Extract the <span className="text-purple-600 dark:text-purple-400">PDF Data</span> you need
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-indigo-200/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload invoices, statements, or reports and get clean, structured data back in seconds — JSON, CSV, Excel, or SQL, no templates to configure.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-base font-bold px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm w-full sm:w-auto justify-center"
              >
                Get started free <HiOutlineArrowRight size={18} />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-xl border border-slate-300 dark:border-indigo-800 text-slate-700 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-[#18182f] transition w-full sm:w-auto justify-center backdrop-blur-sm"
              >
                See a live extraction
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-indigo-200/80">
                <HiOutlineLightningBolt className="text-purple-600 dark:text-purple-400" /> Instant
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-indigo-200/80">
                <HiOutlineCheck className="text-purple-600 dark:text-purple-400" /> 99%+ accurate
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-indigo-200/80">
                <HiOutlineShieldCheck className="text-purple-600 dark:text-purple-400" /> Secure & private
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- EXTRACT BY DOCUMENT TYPE ---------- */}
      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 bg-slate-50 dark:bg-[#0f0f1c] border-y border-slate-200 dark:border-indigo-950/60">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Our extraction
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Extract by document type
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-indigo-200/80 mt-3">
              Every document type has its own layout logic — pdf2data already knows how to read these.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {documentTypes.map(({ name, desc, icon: Icon, image }) => (
              <div
                key={name}
                className="group bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 rounded-2xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition"
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-white/95 dark:bg-[#18182f]/95 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">{name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mb-3">{desc}</p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-2.5 transition-all"
                  >
                    Try it <HiOutlineArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED FORMATS ---------- */}
      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Export formats
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Export in whatever shape you need
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {formats.map(({ name, tag, badgeClass, sample }) => (
              <div
                key={name}
                className="relative bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 rounded-2xl p-6 flex flex-col items-start gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
                  {tag}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{name}</h3>
                <div className="w-full rounded-lg bg-[#121222] p-3 overflow-hidden">
                  {sample.map((line, i) => (
                    <p key={i} className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-indigo-200/90 truncate">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
            >
              Start extracting <HiOutlineArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- CHAT WITH YOUR DOCUMENTS  ---------- */}
      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 bg-slate-50 dark:bg-[#0f0f1c] border-y border-slate-200 dark:border-indigo-950/60">
        <div className="w-full max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-3 py-1.5 rounded-full">
              New
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Or just <span className="text-purple-600 dark:text-purple-400">ask it</span> a question
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-indigo-200/80 leading-relaxed max-w-md mx-auto lg:mx-0">
              Skip the export entirely. Upload a document and chat with it directly — ask for a total, a clause, a date, or a specific line item, in plain language.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-indigo-200/80 max-w-md mx-auto lg:mx-0">
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <HiOutlineCheck className="text-purple-600 dark:text-purple-400 shrink-0" /> Works on any document you've uploaded
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <HiOutlineCheck className="text-purple-600 dark:text-purple-400 shrink-0" /> Answers point back to the source field
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <HiOutlineCheck className="text-purple-600 dark:text-purple-400 shrink-0" /> No extra setup — it's on by default
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
              >
                Try document chat <HiOutlineArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden max-w-lg mx-auto">
              <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-indigo-950 bg-slate-50 dark:bg-[#121222]">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <HiOutlineChat size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">invoice_08234.pdf</p>
                  <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">Ready to chat</p>
                </div>
              </div>

              <div className="px-4 sm:px-5 py-5 space-y-3.5 sm:space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-purple-600 text-white rounded-br-sm"
                          : "bg-slate-100 dark:bg-[#121222] text-slate-700 dark:text-indigo-200/90 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#121222] rounded-xl px-3.5 py-2.5">
                  <span className="flex-1 text-xs sm:text-sm text-slate-400 dark:text-indigo-300/50">
                    Ask about this document…
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <HiPaperAirplane size={13} className="rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST BADGES ---------- */}
      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 bg-slate-50 dark:bg-[#0f0f1c] border-b border-slate-200 dark:border-indigo-950/60">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Why teams choose us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Built for documents that don't follow a template
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      {/* Section background is a hair off pure white (light mode) so the
          white review cards actually separate from the page instead of
          blending into it. Dark mode is untouched.
          Reviews now auto-scroll HORIZONTALLY in a single row (was a
          vertical column) with smaller, fixed-width cards. */}
      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 bg-[#f8f7fb] dark:bg-[#0b0b14]">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase text-purple-600 dark:text-purple-400">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              What our customers say
            </h2>
          </div>

          <div className="reviews-marquee-pause relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
            {/* fade masks left and right so cards don't cut off harshly */}
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[#f8f7fb] dark:from-[#0b0b14] to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#f8f7fb] dark:from-[#0b0b14] to-transparent z-10" />

            <div className="reviews-marquee flex flex-row gap-5">
              {marqueeReviews.map((r, i) => (
                <ReviewCard r={r} key={`${r.email || r.name}-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-slate-200 dark:border-indigo-950 bg-white dark:bg-[#0b0b14] pt-12 sm:pt-16 pb-8 transition-colors mt-auto w-full">
        <div className="w-full px-4 sm:px-8 md:px-14 lg:px-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 pb-10 sm:pb-14">
            <div>
              <img src={logo} alt="PDF2DATA" className="h-8 w-auto object-contain mb-4" />
              <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 leading-relaxed max-w-xs">
                Turn any PDF into clean, structured data — JSON, CSV, Excel, or SQL, in seconds.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#18182f] text-slate-600 dark:text-indigo-300 flex items-center justify-center hover:bg-purple-600 hover:text-white transition"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick links</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70">
                <li><Link to="/new-extraction" className="hover:text-purple-600 dark:hover:text-purple-400">New Extraction</Link></li>
                <li><Link to="/home" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link></li>
                <li><Link to="/extractions" className="hover:text-purple-600 dark:hover:text-purple-400">Extractions</Link></li>
                <li><Link to="/history" className="hover:text-purple-600 dark:hover:text-purple-400">History</Link></li>
                <li><Link to="/settings" className="hover:text-purple-600 dark:hover:text-purple-400">Settings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Formats</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70">
                <li>JSON export</li>
                <li>CSV export</li>
                <li>Excel export</li>
                <li>SQL export</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Get in touch</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70">
                <li className="flex items-start gap-2">
                  <HiOutlineLocationMarker className="mt-0.5 shrink-0" /> Remote-first, worldwide
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlinePhone /> +91 00000 00000
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineMail /> Athenura@pdf2data.com
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-indigo-950 text-xs text-slate-400 dark:text-indigo-300/50">
            <span>© 2026 PDF2Data. All rights reserved.</span>
            <p className="inline-flex items-center gap-1.5">
              <span>Made with</span>
              <HiHeart className="text-red-500 text-sm" />
              <span>by Athenura</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}