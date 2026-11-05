export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a discount tag and shopping bag"
    >
      {/* background blobs */}
      <circle cx="260" cy="240" r="210" fill="#EEF5FF" />
      <circle cx="400" cy="110" r="70" fill="#FFE9DD" />
      <circle cx="90" cy="360" r="55" fill="#DCFCE7" />

      {/* shopping bag */}
      <g transform="translate(60 150) rotate(-6)">
        <rect x="0" y="40" width="150" height="150" rx="16" fill="#0F172A" />
        <rect x="8" y="48" width="134" height="134" rx="10" fill="#1E293B" />
        <path
          d="M35 60 V35 a40 40 0 0 1 80 0 V60"
          stroke="#1C3EF0"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="55" cy="115" r="9" fill="#C93900" />
        <circle cx="95" cy="115" r="9" fill="#15803D" />
        <rect x="35" y="145" width="80" height="10" rx="5" fill="#475569" />
      </g>

      {/* discount tag */}
      <g transform="translate(230 70) rotate(10)">
        <rect
          x="0"
          y="0"
          width="190"
          height="190"
          rx="28"
          fill="#1C3EF0"
          style={{ filter: "drop-shadow(0 20px 35px rgba(28,62,240,0.35))" }}
        />
        <circle cx="38" cy="38" r="14" fill="#FFFFFF" />
        <circle cx="38" cy="38" r="6" fill="#1C3EF0" />
        <text
          x="95"
          y="130"
          textAnchor="middle"
          fontSize="72"
          fontWeight="800"
          fill="#FFFFFF"
          fontFamily="var(--font-inter), sans-serif"
        >
          %
        </text>
      </g>

      {/* verified badge */}
      <g transform="translate(360 300)">
        <circle cx="34" cy="34" r="34" fill="#15803D" style={{ filter: "drop-shadow(0 10px 20px rgba(21,128,61,0.35))" }} />
        <path
          d="M20 35 L29 44 L48 24"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* sparkles */}
      <g fill="#C93900">
        <path d="M110 90 l5 14 14 5 -14 5 -5 14 -5 -14 -14 -5 14 -5 z" />
      </g>
      <g fill="#1C3EF0">
        <path d="M440 220 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" />
      </g>
      <g fill="#0F172A" opacity="0.15">
        <circle cx="430" cy="400" r="6" />
        <circle cx="70" cy="80" r="5" />
        <circle cx="200" cy="420" r="5" />
      </g>
    </svg>
  );
}
