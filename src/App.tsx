/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useTypewriter } from './hooks/useTypewriter';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Video mouse-scrub reference states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Typewriter hook for hero message (continuous loop)
  const typewriterText = "We create modern, user-friendly interfaces that combine creativity, functionality, and beautiful design to bring ideas to life.";
  const { displayed, done } = useTypewriter(typewriterText, {
    speed: 30,
    startDelay: 400,
    loop: true,
    holdDuration: 2200,
    deleteSpeed: 14,
  });

  // Pill buttons appear 400ms after load independent of typewriter
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle video seek queueing to prevent seek-flooding
  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime;
    }
  };

  // Mouse scrubbing event listeners
  useEffect(() => {
    const SENSITIVITY = 0.8;

    const handlePointerMove = (clientX: number) => {
      const video = videoRef.current;
      if (!video) return;
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;

      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        targetTimeRef.current = video.currentTime;
        return;
      }

      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const nextTarget = Math.min(Math.max(0, targetTimeRef.current + timeOffset), duration);
      targetTimeRef.current = nextTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = nextTarget;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };

    const onMouseLeave = () => {
      prevXRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevXRef.current = e.touches[0].clientX;
        if (videoRef.current) {
          targetTimeRef.current = videoRef.current.currentTime;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Action to copy email address
  const handleCopyEmail = async () => {
    const email = 'hello@mainframe.co';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks = ['Labs', 'Studio', 'Openings', 'Shop'];
  const pillButtons = [
    'View my work',
    'Design services',
    'Book a call',
    'Download résumé',
  ];

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overflow-hidden font-[var(--font-body)]">
      {/* BACKGROUND VIDEO (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={handleLoadedMetadata}
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ objectPosition: '70% center' }}
      />

      {/* NAVBAR (fixed, z-index: 10) */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center">
        {/* Logo (left) */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-white select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
ABHI786-TECH
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            💀
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        {/* <nav className="hidden md:flex flex-row items-center text-[23px] text-white">
          {navLinks.map((link, idx) => (
            <span key={link} className="inline-flex items-center">
              <a
                href={`#${link.toLowerCase()}`}
                className="hover:opacity-60 transition-opacity"
              >
                {link}
              </a>
              {idx < navLinks.length - 1 && <span>,&nbsp;</span>}
            </span>
          ))}
        </nav> */}

        {/* Desktop CTA (right, hidden below md) */}
        <a
          href="mailto:abhiofficial458@gmail.com"
          className="hidden md:block text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer focus:outline-none z-20 gap-[5px]"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* MOBILE OVERLAY (z-index: 9) */}
      {/* <div
        className={`fixed inset-0 z-[9] bg-black/90 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={() => setMobileMenuOpen(false)}
            className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
          >
            {link}
          </a>
        ))}
        <a
          href="mailto:hello@mainframe.co"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[32px] font-medium text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>
      </div> */}

      {/* HERO SECTION (z-index: 1) */}
      <main className="h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative z-[1]">
        {/* Content container */}
        <div className="max-w-3xl relative z-10">
          {/* 1. Bold intro label (blur -> sharp -> blur -> sharp loop) */}
          <div
            className="hero-blur-loop pointer-events-none select-none mb-5 sm:mb-6 text-white"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 5vw, 38px)',
              lineHeight: 1.22,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#fff',
            }}
          >
            Hey, I am A.B.H.I.
            <br />
            Turns Ideas Into Beautiful Digital Experiences
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-white mb-5 sm:mb-6 font-normal min-h-[78px] opacity-70"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] cursor-blink" />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0px)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* 4 white pill buttons */}
            {pillButtons.map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}

            {/* 1 outline pill button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3 group"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  {copied ? 'Copied to clipboard' : 'abhiofficial458@gmail.com'}
                </span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block shrink-0 stroke-current"
                aria-hidden="true"
              >
                {copied ? (
                  <path
                    d="M2.5 6.5L4.5 8.5L9.5 3.5"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <rect x="3.5" y="3.5" width="7" height="7" rx="1" strokeWidth="1.2" />
                    <path
                      d="M8.5 2V1.5C8.5 1.22386 8.27614 1 8 1H1.5C1.22386 1 1 1.22386 1 1.5V8C1 8.27614 1.22386 8.5 1.5 8.5H2"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
