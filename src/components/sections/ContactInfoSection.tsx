import { MessageCircle, Mail, MapPin } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export function ContactInfoSection() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10">
      <h3 className="font-serif text-2xl text-brand-taupe mb-6">
        Contact Information
      </h3>

      {/* WhatsApp */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors duration-300 mb-5 group"
      >
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe">Chat via WhatsApp</p>
          <p className="text-sm text-brand-taupe/60">+62 812-3456-7890</p>
        </div>
      </a>

      {/* Email */}
      <a
        href="mailto:hello@solaplanner.com"
        className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-sand/50 transition-colors duration-300 mb-2 group"
      >
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/20 transition-colors duration-300">
          <Mail className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe">Email Us</p>
          <p className="text-sm text-brand-taupe/60">hello@solaplanner.com</p>
        </div>
      </a>

      {/* Address */}
      <div className="flex items-start gap-4 p-4 rounded-xl mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe mb-1">Visit Our Office</p>
          <p className="text-sm text-brand-taupe/60 leading-relaxed">
            Jl. Sudirman No. 123, Suite 456<br />
            Jakarta Selatan, 12190<br />
            Indonesia
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-sand/50 mb-6" />

      {/* Social icons */}
      <p className="text-sm text-brand-taupe/60 mb-4">Follow Us</p>
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="w-10 h-10 rounded-full border border-brand-sand flex items-center justify-center text-brand-taupe/50 hover:text-brand-gold hover:border-brand-gold/30 hover:scale-110 transition-all duration-300"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
