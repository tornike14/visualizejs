import { ImageResponse } from "next/og";
import {
  SITE_NAME,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from "@/lib/constants";

export const SOCIAL_IMAGE_SIZE = {
  width: SOCIAL_IMAGE_WIDTH,
  height: SOCIAL_IMAGE_HEIGHT,
};

interface SocialImageOptions {
  /** Small uppercase line above the title. */
  kicker: string;
  title: string;
  subtitle: string;
  /** RGB triplet, e.g. "247 223 30", used for the kicker and the glow. */
  accentRgb?: string;
}

const rgb = (triplet: string, alpha = 1) =>
  `rgba(${triplet.split(" ").join(", ")}, ${alpha})`;

/**
 * One layout for every Open Graph image on the site: the home page, each
 * category, and each topic. Satori (next/og) only supports flexbox, so every
 * box declares display: flex.
 */
export const renderSocialImage = ({
  kicker,
  title,
  subtitle,
  accentRgb = "103 232 249",
}: SocialImageOptions) =>
  new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        color: "#f8fafc",
        background: `linear-gradient(135deg, #0b1220 0%, #13213d 60%, ${rgb(accentRgb, 0.22)} 100%)`,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          letterSpacing: 2,
          color: rgb(accentRgb),
          textTransform: "uppercase",
        }}
      >
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 24 ? 64 : 84,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#bfdbfe",
            maxWidth: 1000,
            lineHeight: 1.25,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 26,
          color: "#94a3b8",
        }}
      >
        <span>{SITE_NAME}</span>
        <span>visualizejs.com</span>
      </div>
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
