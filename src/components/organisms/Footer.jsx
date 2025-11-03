import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Shop": [
      { label: "Skincare", href: "/category/skincare" },
      { label: "Makeup", href: "/category/makeup" },
      { label: "Haircare", href: "/category/haircare" },
      { label: "Fragrance", href: "/category/fragrance" },
      { label: "Tools & Accessories", href: "/category/tools" }
    ],
    "Collections": [
      { label: "Best Sellers", href: "/collections" },
      { label: "New Arrivals", href: "/collections" },
      { label: "Clean Beauty", href: "/collections" },
      { label: "Anti-Aging", href: "/collections" }
    ],
    "Customer Care": [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" }
    ],
    "Company": [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Sustainability", href: "/sustainability" }
    ]
  };

  const socialLinks = [
    { icon: "Instagram", href: "#", label: "Instagram" },
    { icon: "Facebook", href: "#", label: "Facebook" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Youtube", href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-b from-surface to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Stay in the Glow
            </h3>
            <p className="text-gray-600 font-body mb-6">
              Get beauty tips, exclusive offers, and new product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium font-body hover:brightness-110 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Glow Market
                </span>
              </Link>
              <p className="text-gray-600 font-body mb-6 max-w-md">
                Your trusted destination for clean, effective beauty products that enhance your natural glow.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <ApperIcon name={social.icon} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-display font-semibold text-gray-900 mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-600 font-body hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600 font-body">
              <p>&copy; {currentYear} Glow Market. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
              <ApperIcon name="Shield" className="w-4 h-4" />
              <span>Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;