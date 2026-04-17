import { Link } from "react-router-dom";

interface BrandMarkProps {
  mode?: "onLight" | "onMedia";
  src?: string;
}

const BrandMark = ({ mode: _mode, src = "/triovate.png" }: BrandMarkProps) => (
  <Link
    to="/"
    className="inline-flex items-center"
    aria-label="Triovate Labs — Home"
  >
    <img
      src={src}
      alt="Triovate Labs"
      width={160}
      height={160}
      fetchPriority="high"
      className="h-28 sm:h-36 md:h-40 w-auto object-contain"
      style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.3))' }}
    />
  </Link>
);

export default BrandMark;
