export type IconName =
  | 'cube' | 'moon' | 'gear'
  | 'cart' | 'fork' | 'car' | 'coffee' | 'ticket' | 'bag'
  | 'mic' | 'chev' | 'send' | 'stop'| 'lock';

export default function Icon({ name, className = 'w-5 h-5' }: { name: IconName; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'cube':
      return (
        <svg {...common}>
          <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
          <path d="M3 7.5V16.5L12 21l9-4.5V7.5" />
          <path d="M12 12V21" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M16.9 16.9l2.2 2.2M2 12h3M19 12h3M4.9 19.1l2.1-2.1M16.9 7.1l2.2-2.2" />
        </svg>
      );
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 3h2l2 12h10l2-7H7" />
        </svg>
      );
    case 'fork':
      return (
        <svg {...common}>
          <path d="M8 3v7a3 3 0 0 0 6 0V3" />
          <path d="M12 14v7" />
        </svg>
      );
    case 'car':
      return (
        <svg {...common}>
          <path d="M3 13l2-5a3 3 0 0 1 3-2h8a3 3 0 0 1 3 2l2 5" />
          <path d="M5 16h14" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
        </svg>
      );
    case 'coffee':
      return (
        <svg {...common}>
          <path d="M3 8h13v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z" />
          <path d="M16 8h2a3 3 0 1 1 0 6h-2" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...common}>
          <path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14l2-2V7l-2-2H5a2 2 0 0 0-2 2v2Z" />
          <path d="M13 6v12" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M6 7h12l1 13H5L6 7Z" />
          <path d="M9 7a3 3 0 1 1 6 0" />
        </svg>
      );
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="10" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
          <path d="M12 19v3" />
        </svg>
      );
    case 'chev':
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case 'send':
    return (
      <svg {...common}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9 22 2" />
      </svg>
    );
    case 'stop':
    return (
      <svg {...common}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
    case 'lock':
    return (
      <svg {...common}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </svg>
    );
    default:
      return null;
  }
}
