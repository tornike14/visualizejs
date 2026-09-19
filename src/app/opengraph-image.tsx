import { SOCIAL_IMAGE_ALT } from "@/lib/constants";
import { renderSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/socialImage";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialImage({
    kicker: "Visualize concepts, not just syntax",
    title: "VisualizeJS",
    subtitle:
      "Interactive visualizations of JavaScript, React, backend systems, and AI models, one step at a time.",
  });
}
