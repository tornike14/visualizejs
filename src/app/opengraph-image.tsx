import { ImageResponse } from "next/og";
import {
  SITE_NAME,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from "@/lib/constants";

export const alt = SOCIAL_IMAGE_ALT;
export const size = {
  width: SOCIAL_IMAGE_WIDTH,
  height: SOCIAL_IMAGE_HEIGHT,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#f8fafc",
          background:
            "linear-gradient(135deg, #0b1220 0%, #13213d 55%, #0f766e 100%)",
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
            color: "#67e8f9",
            textTransform: "uppercase",
          }}
        >
          Visualize concepts, not just syntax
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#bfdbfe",
              maxWidth: 980,
              lineHeight: 1.2,
            }}
          >
            Interactive JavaScript and React visualizations for mastering core
            runtime concepts.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
