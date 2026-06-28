import type { Metadata } from "next";
import { Unbounded, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KC // kevcspot — AI, Casinos & Code",
  description: "Kevin's personal blog — AI projects, model breakdowns, sweepstakes casino strategy, and technical tutorials.",
  metadataBase: new URL("https://kc.kevcspot.com"),
  openGraph: {
    title: "KC // kevcspot",
    description: "AI projects, model breakdowns, sweepstakes casino strategy, and technical tutorials.",
    url: "https://kc.kevcspot.com",
    siteName: "kc.kevcspot.com",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col relative">
        <Nav />
        <main className="flex-1 relative z-10 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  let postCount = 0;
  try {
    postCount = getAllPosts().length;
  } catch {}

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[rgba(8,8,12,0.85)] backdrop-blur-xl navbar-underglow">
      <div className="max-w-6xl mx-auto h-full flex items-end justify-between">
        <Link href="/" className="flex items-center gap-2 mb-3 ml-6 group">
          <span className="font-display font-800 text-lg tracking-tight">
            <span className="gradient-gold">KC</span>
            <span className="text-[var(--text-dim)] mx-0.5">//</span>
            <span className="gradient-cyan">kevcspot</span>
          </span>
        </Link>
        <div className="foldertab-nav mb-0 mr-2">
          <FolderTab href="/" label="Blog" />
          <FolderTab href="/about" label="About" />
          <FolderTab href="/ai" label="AI" />
          <FolderTab href="/tutorials" label="Tutorials" />
          <FolderTab href="/admin" label="CMS" />
        </div>
      </div>
    </nav>
  );
}

function FolderTab({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="foldertab" data-active="">
      <span className="foldertab-tab-icon">▸</span>
      {label}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="font-display font-700 text-sm mb-2">
              <span className="gradient-gold">KC</span>
              <span className="text-[var(--text-dim)] mx-0.5">//</span>
              <span className="gradient-cyan">kevcspot</span>
            </div>
            <p className="text-sm text-[var(--text-dim)] max-w-xs">
              AI engineer, sweepstakes casino strategist, local LLM enthusiast.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-dim)] mb-3">Navigate</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">About</Link></li>
                <li><Link href="/ai/projects" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">AI Projects</Link></li>
                <li><Link href="/ai/models" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">AI Models</Link></li>
                <li><Link href="/tutorials" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">Tutorials</Link></li>
                <li><Link href="/admin" className="text-sm text-[var(--text)] hover:text-[var(--gold-bright)] transition-colors">CMS Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="divider-gold my-8" />
        <p className="text-xs text-[var(--text-dim)] font-mono">
          © 2026 Kevin // Built with Next.js 16, deployed on Vercel // AI-powered CMS
        </p>
      </div>
    </footer>
  );
}
