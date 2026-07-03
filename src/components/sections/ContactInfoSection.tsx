import { MessageCircle, Mail, MapPin } from "lucide-react";

export function ContactInfoSection() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10 h-full">
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
        className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-sand/50 transition-colors duration-300 mb-5 group"
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
      <div className="flex items-start gap-4 p-4 rounded-xl">
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
    </div>
  );
}
