"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Loader2,
  Mail,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [verified, setVerified] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!email.includes("@") || attempts >= 3) {
      setNotice(
        attempts >= 3
          ? "Too many OTP attempts. Try again later."
          : "Enter a valid email address.",
      );
      return;
    }

    setSent(true);
    setSeconds(30);
    setAttempts((value) => value + 1);
    setNotice("OTP sent. It expires in 5 minutes.");
  }

  function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.trim().length !== 6) {
      setNotice("Enter the 6 digit OTP from email.");
      return;
    }

    setVerified(true);
    setNotice("Email verified. Complete your profile to continue.");
  }

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <SiteHeader />
      <section className="mx-auto grid max-w-none gap-8 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 2xl:px-12">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-coral">
            Email OTP Login
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
            Fast customer login without passwords.
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone">
            Customers can browse without login. Login is used only for sending
            enquiries, callback requests, and faster future bookings.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "OTP expires after 5 minutes.",
              "Resend is delayed by 30 seconds.",
              "Attempts are limited to reduce spam.",
              "First-time users accept Terms and Privacy.",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-mint" />
                <span className="font-bold text-stone">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          {!sent ? (
            <form onSubmit={sendOtp} className="grid gap-5">
              <h2 className="text-3xl font-black">Enter email</h2>
              <label className="grid gap-2 text-sm font-black">
                Email address
                <span className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-stone" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="customer@example.com"
                    className="h-12 w-full rounded-md border border-ink/15 bg-ivory px-3 pl-11 text-base outline-none focus:border-coral"
                  />
                </span>
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 font-black text-white transition hover:bg-stone">
                <Mail className="h-5 w-5" />
                Send OTP
              </button>
            </form>
          ) : null}

          {sent && !verified ? (
            <form onSubmit={verifyOtp} className="grid gap-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-black">Verify OTP</h2>
                  <p className="mt-1 text-sm font-semibold text-stone">
                    Sent to {email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setOtp("");
                    setNotice("");
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-ink/15 px-3 text-sm font-black transition hover:border-coral hover:text-coral"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit email
                </button>
              </div>

              <label className="grid gap-2 text-sm font-black">
                6 digit OTP
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="h-12 rounded-md border border-ink/15 bg-ivory px-3 text-base tracking-[0.4em] outline-none focus:border-coral"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-coral px-4 font-black text-ink transition hover:bg-coral/90">
                  <CheckCircle2 className="h-5 w-5" />
                  Verify
                </button>
                <button
                  type="button"
                  disabled={seconds > 0 || attempts >= 3}
                  onClick={() => {
                    setSeconds(30);
                    setAttempts((value) => value + 1);
                    setNotice("OTP resent. Check inbox and spam folder.");
                  }}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-ink/15 px-4 font-black transition hover:border-coral hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {seconds > 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                  {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-md bg-coral/15 p-4 text-sm font-semibold text-stone">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                Check spam or promotions before requesting another OTP. Too
                many attempts will temporarily block login.
              </div>
            </form>
          ) : null}

          {verified ? (
            <form className="grid gap-5">
              <h2 className="text-3xl font-black">First-time setup</h2>
              <label className="grid gap-2 text-sm font-black">
                Full name
                <span className="relative">
                  <User className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-stone" />
                  <input className="h-12 w-full rounded-md border border-ink/15 bg-ivory px-3 pl-11 text-base outline-none focus:border-coral" />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Phone with country code
                <span className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-stone" />
                  <input
                    placeholder="+91 98765 43210"
                    className="h-12 w-full rounded-md border border-ink/15 bg-ivory px-3 pl-11 text-base outline-none focus:border-coral"
                  />
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-md border border-ink/10 bg-ivory p-3 text-sm font-bold">
                <input type="checkbox" className="mt-1 size-4 accent-coral" />
                I accept Road Track Terms and Privacy Policy.
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-4 font-black text-white transition hover:bg-stone">
                <CheckCircle2 className="h-5 w-5" />
                Continue
              </button>
            </form>
          ) : null}

          {notice ? (
            <p className="mt-5 rounded-md bg-mint/20 p-3 text-sm font-bold text-stone">
              {notice}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
