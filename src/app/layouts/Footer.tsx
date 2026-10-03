import { Link } from "react-router";

const linkClass = "text-[12px] text-hm-muted no-underline";

export default function Footer() {
  return (
    <footer className="flex min-h-[180px] items-end gap-10 bg-hm-text px-[clamp(20px,5vw,72px)] py-14 text-white max-[600px]:flex-col max-[600px]:items-start">
      <strong>HartMart</strong>
      <span className="text-[11px] text-[#999]">Thoughtful commerce, made for Nigeria.</span>
      <nav className="ml-auto flex gap-6 max-[600px]:ml-0">
        <Link className={linkClass} to="/products">
          Shop
        </Link>
        <Link className={linkClass} to="/vendors">
          Vendors
        </Link>
        <Link className={linkClass} to="/become-a-vendor">
          Sell
        </Link>
        <Link className={linkClass} to="/account">
          Account
        </Link>
      </nav>
    </footer>
  );
}
