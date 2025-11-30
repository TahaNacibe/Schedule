/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

interface IconProps {
  src: string; // SVG path
  className?: string;
  themeColor?: "light" | "dark"; // Optional override
}

type SvgCache = Map<string, string>;

// Global cache to avoid re-fetching the same SVG across components/instances
const svgCache: SvgCache = new Map();

const Icon: React.FC<IconProps> = ({ src, className = "", themeColor }) => {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // Check cache first
    if (svgCache.has(src)) {
      const cached = svgCache.get(src)!;
      console.log(`Using cached SVG for ${src}`); // Optional log
      setSvgContent(cached);
      return;
    }

    // Fetch if not cached
    fetch(src)
      .then((res) => res.text())
      .then((svg) => {
        console.log(`Fetched and cached SVG for ${src}`);

        // Comprehensive replacement for black variants to currentColor
        // Matches: #000000, #000, black, rgb(0,0,0) and whitespace variants
        const blackRegex =
          /(fill|stroke)=["'](#000000|#000|black|rgb\s*\(\s*0\s*,\s*0\s*,\s*0\s*\))["']/gi;
        const themedSvg = svg.replace(blackRegex, '$1="currentColor"');

        // Cache it
        svgCache.set(src, themedSvg);
        setSvgContent(themedSvg);
      })
      .catch((err) => {
        console.error(`SVG load failed for ${src}:`, err);
        setSvgContent(""); // Reset on error
      });
  }, [src]);

  if (!svgContent) {
    // Improved placeholder: Gray box to match theme subtly
    return (
      <div
        className={`w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        aria-label="Loading icon"
      />
    );
  }

  const themeClass = themeColor === "dark" ? "text-white" : "text-black";

  return (
    <div
      className={`inline-block transition-colors duration-150 ease-in-out w-6 h-6 ${themeClass} ${className}`}
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

export default Icon;
