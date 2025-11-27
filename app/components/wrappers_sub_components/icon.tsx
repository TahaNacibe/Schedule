import { useState, useEffect } from "react";

interface IconProps {
  src: string;  // SVG path
  className?: string;
  themeColor?: 'light' | 'dark';  // Optional override
}

const Icon: React.FC<IconProps> = ({ src, className = '', themeColor }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(svg => {
        // Ensure currentColor for stroke/fill
        const themedSvg = svg.replace(/stroke="black"/g, 'stroke="currentColor"').replace(/fill="black"/g, 'fill="currentColor"');
        setSvgContent(themedSvg);
      })
      .catch(err => console.error('SVG load failed:', err));
  }, [src]);

  if (!svgContent) return <div className={`w-6 h-6 ${className}`} />;  // Placeholder

  return (
      <div className={`inline-block transition-all duration-100 ${themeColor === 'dark' ? 'text-white' : 'text-gray-800'} ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
};


export default Icon;