"use client"

import { motion } from "framer-motion"

const messages = [
  "Freshly roasted beans daily",
  "Weekend brunch specials",
  "Reserve your cozy corner",
  "Free delivery on orders above Rs. 999",
]

export function AnnouncementBanner() {
  return (
    <div className="overflow-hidden bg-primary text-primary-foreground group">
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 24s linear infinite;
        }
        .group:hover .animate-custom-marquee {
          animation-play-state: paused;
        }
      `}</style>
      <div
        className="flex w-max gap-10 py-3 text-sm font-medium uppercase tracking-[0.18em] animate-custom-marquee"
      >
        {[...messages, ...messages, ...messages, ...messages].map((message, index) => (
          <span key={`${message}-${index}`} className="whitespace-nowrap cursor-default">
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
