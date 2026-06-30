"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Bell,
  Bot,
  Building2,
  Check,
  CreditCard,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Wifi
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { DashboardPreview } from "@/components/dashboard-preview";
import { LoginPanel } from "@/components/login-panel";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const { theme, setTheme } = useTheme();
  const features = useMemo(
    () => [
      ["Real-time rooms", "Vacancy, allocation, AC/Non-AC filters, and live booking updates.", Building2],
      ["Student lifecycle", "Applications, leave, visitors, attendance, complaints, and profiles.", Users],
      ["Payments", "Dues, receipts, invoices, Razorpay/Stripe-ready payment records.", CreditCard],
      ["Live alerts", "Socket.io notices, fee reminders, emergencies, and complaint updates.", Bell],
      ["AI helpdesk", "Chatbot-ready support layer for common hostel questions.", Bot],
      ["Secure access", "JWT, roles, validation, rate limits, and protected API routes.", ShieldCheck]
    ],
    []
  );

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="grid-pattern relative min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">HostelOS</span>
          </div>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => setShowAuth(true)}>
              Sign in
            </Button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 pb-16 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:pt-24">
          <motion.div {...fade}>
            <Badge className="mb-5 bg-white/80 text-teal-700 dark:bg-slate-900/80 dark:text-teal-300">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Real-time hostel operations suite
            </Badge>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              HostelOS
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Premium hostel management for modern campuses: admissions, rooms, fees, mess, visitors, security,
              attendance, complaints, notices, and analytics in one responsive SaaS workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 px-6" onClick={() => setShowAuth(true)}>
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" className="h-12 px-6" asChild>
                <a href="#features">Explore features</a>
              </Button>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {["99.9% uptime", "12 collections", "3 role portals"].map((item) => (
                <div key={item} className="glass rounded-lg px-4 py-3 text-center text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-teal-500/20 blur-3xl" />
              <div className="glass relative overflow-hidden rounded-2xl p-3 shadow-glow">
                <div className="relative h-[520px] overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=85"
                    alt="Premium hostel lounge"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/15 to-transparent" />
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div {...fade} className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge>Operations cockpit</Badge>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">Built for students, wardens, and admins.</h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              Every module shares the same data model, notification system, and role permissions so teams can work from
              one trusted source of truth.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, body, Icon]) => (
              <Card key={title} className="p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <Icon className="h-8 w-8 text-teal-600 dark:text-teal-300" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {["Airbnb-level clarity", "Notion-like organization", "Stripe-grade trust"].map((quote, index) => (
            <motion.div key={quote} {...fade} transition={{ duration: 0.55, delay: index * 0.08 }}>
              <Card className="h-full border-white/10 bg-white/[0.06] p-6 text-white">
                <Wifi className="h-7 w-7 text-teal-300" />
                <p className="mt-5 text-xl font-semibold">{quote}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  "The dashboard finally made hostel operations feel calm, fast, and accountable."
                </p>
                <p className="mt-5 text-sm font-bold text-teal-200">Campus Operations Team</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {[
            ["Starter", "For a single hostel block", "$199/mo", ["Rooms", "Students", "Complaints"]],
            ["Campus", "For multi-block institutions", "$499/mo", ["Everything in Starter", "Fees", "Visitors", "Analytics"]],
            ["Enterprise", "For universities and groups", "Custom", ["SSO-ready", "Custom reports", "Priority support"]]
          ].map(([name, subtitle, price, items]) => (
            <Card key={name} className="p-6">
              <h3 className="text-2xl font-black">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              <p className="mt-6 text-4xl font-black">{price}</p>
              <div className="mt-6 space-y-3">
                {items.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-teal-600" /> {item}
                  </p>
                ))}
              </div>
              <Button className="mt-7 w-full" variant={name === "Campus" ? "default" : "secondary"}>Choose plan</Button>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-2xl bg-slate-950 p-6 text-white shadow-glow md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <Badge className="border-white/20 text-teal-200">Book a demo</Badge>
            <h2 className="mt-5 text-3xl font-black">Launch a smarter hostel desk.</h2>
            <p className="mt-4 text-slate-300">Tell us your room count and workflows. The API and UI are ready to customize.</p>
          </div>
          <form className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-md border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="Name" />
            <input className="rounded-md border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="Email" />
            <input className="rounded-md border-white/10 bg-white/10 px-4 py-3 outline-none sm:col-span-2" placeholder="Institution" />
            <textarea className="min-h-28 rounded-md border-white/10 bg-white/10 px-4 py-3 outline-none sm:col-span-2" placeholder="What do you want to automate first?" />
            <Button className="sm:col-span-2" type="button">Send request</Button>
          </form>
        </div>
      </section>

      {showAuth && <LoginPanel onClose={() => setShowAuth(false)} />}
    </main>
  );
}
