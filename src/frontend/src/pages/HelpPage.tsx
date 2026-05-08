import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronRight,
  Cloud,
  CreditCard,
  Globe,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  Share2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

interface FaqSection {
  id: string;
  title: string;
  icon: React.ElementType;
  faqs: FAQ[];
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    faqs: [
      {
        q: "How do I scan a document?",
        a: "Tap the Scan button in the bottom navigation. You can either capture a live photo using your camera, or upload an existing image from your gallery. After capturing, the app will automatically detect edges and crop the document. You can then enhance the image before running OCR.",
      },
      {
        q: "What languages are supported?",
        a: "ScanText Pro supports 7 languages: English, Hindi, Arabic, Urdu, Marathi, Tamil, and Malayalam. Select your language before scanning for best results. Free users get all 7 languages for basic OCR; Premium users get higher-accuracy Cloud OCR for all languages.",
      },
      {
        q: "How does OCR work?",
        a: "Optical Character Recognition (OCR) analyses the shapes of letters and words in your image. Free users get on-device OCR powered by Google ML Kit — it works completely offline and is fast on any device. Premium users also get access to Google Vision AI (Cloud OCR) for higher accuracy on complex documents, receipts, and handwriting.",
      },
    ],
  },
  {
    id: "free-vs-premium",
    title: "Free vs Premium",
    icon: CreditCard,
    faqs: [
      {
        q: "What's included in the free plan?",
        a: "The free plan gives you 10 scans per day, basic OCR in all 7 languages, TXT and watermarked PDF export, and scan history for up to 50 documents. It's great for occasional scanning needs.",
      },
      {
        q: "How do I upgrade to Premium?",
        a: "Go to Profile → Upgrade to Premium, or tap the Premium banner on the home screen. Choose Monthly (₹299/mo) or Annual (₹2,499/yr, save 30%). Payment is processed securely via Stripe.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel anytime from your Profile page. You'll retain Premium access until the end of your billing period. We offer a 30-day money-back guarantee — contact support if you need a refund.",
      },
    ],
  },
  {
    id: "scanning-tips",
    title: "Scanning Tips",
    icon: Sparkles,
    faqs: [
      {
        q: "How to get the best OCR results?",
        a: "1. Use good, even lighting — avoid harsh shadows or glare. 2. Hold your phone steady and parallel to the document. 3. Place the document on a flat, contrasting surface. 4. Ensure all text is within the frame. 5. Use the Enhance tools to boost contrast and remove shadows before running OCR.",
      },
      {
        q: "Why is my text not being recognised?",
        a: "Common causes: poor lighting, blurry image, very small text, or unusual fonts. Try: increasing brightness and contrast in the Enhance screen, making sure the document is flat and well-lit, using Cloud OCR (Premium) for complex documents, or switching to a different language setting if the text is multilingual.",
      },
      {
        q: "Can it read handwriting?",
        a: "Yes! ScanText Pro can read handwritten text, though accuracy varies with handwriting clarity. Neat, printed handwriting achieves high accuracy. Cursive or informal handwriting works best with Cloud OCR (Premium). Using good lighting and a clean background significantly improves results.",
      },
    ],
  },
  {
    id: "export-sharing",
    title: "Export & Sharing",
    icon: Share2,
    faqs: [
      {
        q: "How do I export as PDF?",
        a: "After scanning, tap 'Export' in the OCR result screen and choose PDF. Free users get a watermarked PDF. Premium users get clean, watermark-free PDFs. You can also batch-export multiple scans from the History screen.",
      },
      {
        q: "Can I share to WhatsApp?",
        a: "Yes! After scanning, tap the Share button to open the native share sheet. This uses the Web Share API, which lets you share extracted text or exported files to WhatsApp, email, Google Drive, or any app installed on your device.",
      },
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    icon: Shield,
    faqs: [
      {
        q: "Is my data secure?",
        a: "Yes. ScanText Pro is built on the Internet Computer — a decentralised blockchain platform. Your data is encrypted and stored on-chain. Only you can access your scans using your Internet Identity (no passwords required). We never sell your data or share it with third parties.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Profile → Account → Delete Account. This will permanently and irreversibly delete all your scans, folders, and account data. If you have an active subscription, please cancel it first to avoid future charges.",
      },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? FAQ_SECTIONS.map((section) => ({
        ...section,
        faqs: section.faqs.filter(
          (f) =>
            f.q.toLowerCase().includes(query.toLowerCase()) ||
            f.a.toLowerCase().includes(query.toLowerCase()),
        ),
      })).filter((s) => s.faqs.length > 0)
    : FAQ_SECTIONS;

  return (
    <div
      className="flex flex-col min-h-full bg-background"
      data-ocid="help.page"
    >
      <PageHeader title="Help & Support" showBack />

      {/* Search */}
      <div className="px-4 py-4 bg-card border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles…"
            className="pl-9 rounded-xl bg-background border-border/60 text-sm"
            data-ocid="help.search_input"
            aria-label="Search help articles"
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <EmptySearchState query={query} />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((section) => (
              <FaqGroup key={section.id} section={section} />
            ))}
          </div>
        )}

        {/* Contact section */}
        <ContactSection />
      </div>
    </div>
  );
}

function FaqGroup({ section }: { section: FaqSection }) {
  const { icon: Icon, title, faqs, id } = section;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[11px] font-display font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
        <Accordion type="multiple">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={`${id}-${faq.q}`}
              value={`${id}-${faq.q}`}
              className={cn(
                "border-border/40",
                i === faqs.length - 1 ? "border-b-0" : "",
              )}
              data-ocid={`help.faq_item.${i + 1}`}
            >
              <AccordionTrigger className="px-4 py-3.5 text-sm font-body font-medium text-left hover:no-underline text-foreground [&>svg]:shrink-0">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm font-body text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="mt-6 mb-2">
      <div
        className="rounded-2xl overflow-hidden border border-border/60"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.20 250 / 0.12), oklch(0.72 0.18 200 / 0.08))",
        }}
        data-ocid="help.contact_section"
      >
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <p className="text-sm font-display font-semibold text-foreground">
              Still need help?
            </p>
          </div>
          <p className="text-xs font-body text-muted-foreground mb-4 leading-relaxed">
            Our support team is ready to help you get the most out of ScanText
            Pro. We typically respond within 24 hours.
          </p>
          <a
            href="mailto:support@scantextpro.app"
            className="flex items-center justify-between rounded-xl bg-card border border-border/60 px-4 py-3 group transition-colors hover:border-primary/40"
            data-ocid="help.contact_email_link"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-body font-medium text-foreground">
                  support@scantextpro.app
                </p>
                <p className="text-[11px] font-body text-muted-foreground">
                  Email support · 24h response
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptySearchState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center py-12 text-center"
      data-ocid="help.empty_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <HelpCircle className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-display font-semibold text-foreground mb-1">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="text-xs font-body text-muted-foreground">
        Try different keywords or contact support below.
      </p>
    </div>
  );
}
