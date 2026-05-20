// Inline SVG icon set for Atmos. Stroke-based, 24x24 viewBox.

const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.75, style }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "trips":
      return (
        <svg {...props}>
          <path d="M5 18 L19 6" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="6" r="2" />
          <path d="M9 14 L9.01 14" />
          <path d="M13 10 L13.01 10" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...props}>
          <path d="M3 20 L3 4" />
          <path d="M3 20 L21 20" />
          <path d="M7 16 L11 11 L14 13 L20 6" />
          <circle cx="20" cy="6" r="1.2" fill={color} />
        </svg>
      );
    case "insights":
      return (
        <svg {...props}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "chevron-down":
      return <svg {...props}><path d="M6 9l6 6 6-6" /></svg>;
    case "chevron-right":
      return <svg {...props}><path d="M9 18l6-6-6-6" /></svg>;
    case "arrow-down":
      return <svg {...props}><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></svg>;
    case "arrow-up":
      return <svg {...props}><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>;
    case "arrow-right":
      return <svg {...props}><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>;
    case "flame":
      return (
        <svg {...props}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.3-2.5-.5-5 2-7-.5 3 1.5 4.5 3 6 1.3 1.3 2 2.8 2 4.5a7 7 0 1 1-14 0c0-1.7.7-3.3 1.5-4.5.8 1.5 2 2.5 4 2.5z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.2" fill={color} />
        </svg>
      );
    case "leaf":
      return (
        <svg {...props}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 22l8.5-8.5" />
        </svg>
      );
    case "car":
      return (
        <svg {...props}>
          <path d="M5 17h14" />
          <path d="M5 17v-4l2-5h10l2 5v4" />
          <path d="M5 17v2" />
          <path d="M19 17v2" />
          <circle cx="8" cy="17" r="1.5" />
          <circle cx="16" cy="17" r="1.5" />
        </svg>
      );
    case "train":
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="14" rx="2" />
          <path d="M5 11h14" />
          <path d="M9 17l-2 4" />
          <path d="M15 17l2 4" />
          <circle cx="9" cy="14" r="0.8" fill={color} />
          <circle cx="15" cy="14" r="0.8" fill={color} />
        </svg>
      );
    case "bus":
      return (
        <svg {...props}>
          <path d="M5 17h14" />
          <rect x="5" y="5" width="14" height="12" rx="2" />
          <path d="M5 11h14" />
          <path d="M7 17v2" />
          <path d="M17 17v2" />
          <circle cx="8" cy="14.5" r="0.8" fill={color} />
          <circle cx="16" cy="14.5" r="0.8" fill={color} />
        </svg>
      );
    case "bike":
      return (
        <svg {...props}>
          <circle cx="6" cy="17" r="3.5" />
          <circle cx="18" cy="17" r="3.5" />
          <path d="M6 17l4-9h4l3 9" />
          <path d="M9 8h3" />
          <path d="M14 8l-4 9" />
        </svg>
      );
    case "walk":
      return (
        <svg {...props}>
          <circle cx="13" cy="4" r="1.5" />
          <path d="M9 21l2-6 -2-3 1-4 3 2 2 3" />
          <path d="M15 13l1 8" />
          <path d="M11 9l-3 2" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg {...props}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "alert":
      return (
        <svg {...props}>
          <path d="M12 3l10 18H2z" />
          <path d="M12 10v4" />
          <circle cx="12" cy="17.5" r="0.8" fill={color} />
        </svg>
      );
    case "auto":
      return (
        <svg {...props}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case "manual":
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "plug":
      return (
        <svg {...props}>
          <path d="M9 2v6" />
          <path d="M15 2v6" />
          <path d="M6 8h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z" />
          <path d="M12 18v4" />
        </svg>
      );
    case "credit-card":
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2.5" />
          <path d="M2 10h20" />
          <path d="M6 15h3" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="16" r="1" fill={color} />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    default:
      return null;
  }
};

window.Icon = Icon;
