
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isMobile } = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  return (
    <nav className="bg-background py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="text-xl font-bold">
          MyStore
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <div className="grid gap-4">
                {navLinks.map((link) => (
                  <Link
                    to={link.path}
                    key={link.name}
                    className="text-lg py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to="/cart" className="text-lg py-2 block" onClick={() => setMobileMenuOpen(false)}>
                  Cart ({totalItems})
                </Link>
                {isAuthenticated ? (
                  <Link to="/profile" className="text-lg py-2 block" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="text-lg py-2 block" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" className="text-lg py-2 block" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link to={link.path} key={link.name} className="hover:text-gray-600 transition-colors">
                {link.name}
              </Link>
            ))}

            {/* Cart and Auth Links */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative hover:text-gray-600 transition-colors">
                <ShoppingBag />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link to="/profile" className="hover:text-gray-600 transition-colors">
                  <User />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="hover:text-gray-600 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
