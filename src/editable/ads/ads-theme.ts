// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tune to your brand.
export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid rgba(19,42,46,0.18)',
  shadow: '0 8px 30px rgba(19,42,46,0.12)',
  background: '#fffdf7',
  labelClassName: 'bg-[#244C5A] text-[#FFFDF7]',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '12px', shadow: 'none', border: '1px solid rgba(19,42,46,0.18)' },
  popup: { radius: '24px' },
  header: { radius: '20px', background: '#f5efe6' },
  rail: { radius: '14px' },
  feature: { radius: '18px' },
  interstitial: { radius: '20px', shadow: '0 20px 60px rgba(19,42,46,0.45)' },
  anchor: { radius: '12px', shadow: '0 6px 24px rgba(19,42,46,0.22)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak


