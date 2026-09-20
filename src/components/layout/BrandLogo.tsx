import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** The VisualizeJS wordmark used in the sidebar and the mobile header. */
export const BrandLogo = ({
  href = "/",
  onClick,
  className,
}: BrandLogoProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn("group inline-flex px-1 py-1 transition-all", className)}
  >
    <span className="bg-gradient-to-r from-cyan-300 via-sky-300 via-violet-300 to-amber-300 bg-clip-text text-[1.55rem] font-black tracking-[0.02em] text-transparent drop-shadow-[0_0_14px_rgba(34,211,238,0.24)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]">
      VisualizeJS
    </span>
  </Link>
);
