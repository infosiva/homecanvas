export default function Logo({ name, textClass = '' }: { name: string; textClass?: string }) {
  return (
    <span className="flex items-center gap-2" aria-label={name}>
      <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #be123c, #e11d48)', flexShrink: 0 }} aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l9-8 9 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`font-bold text-[15px] tracking-tight ${textClass}`}>{name}</span>
    </span>
  )
}
