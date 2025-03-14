
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { toast } = useToast();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  // Only add Admin link if user is an admin
  if (isAuthenticated && isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-brand-purple text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-brand-gold">The</span>Perfect<span className="text-brand-gold">Shoppe</span>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-brand-purple/80">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-brand-light border-r-brand-purple p-6">
              <div className="grid gap-4">
                <div className="mb-8">
                  <Link to="/" className="text-xl font-bold flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-brand-gold">The</span>Perfect<span className="text-brand-gold">Shoppe</span>
                  </Link>
                </div>
                
                {navLinks.map((link) => (
                  <Link
                    to={link.path}
                    key={link.name}
                    className="text-lg py-2 block hover:text-brand-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  to="/cart" 
                  className="text-lg py-2 block hover:text-brand-gold transition-colors flex items-center" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart <Badge className="ml-2 bg-brand-gold text-black">{totalItems}</Badge>
                </Link>
                {isAuthenticated ? (
                  <>
                    <div className="py-2 border-t mt-2 border-gray-200">
                      <p className="text-gray-600 text-sm">Signed in as</p>
                      <p className="font-medium">{user?.email}</p>
                      {user?.isAdmin && (
                        <div className="mt-1 text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded inline-block">
                          Administrator
                        </div>
                      )}
                    </div>
                    <button onClick={handleLogout} className="text-lg py-2 text-red-500 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-lg py-2 block hover:text-brand-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" className="text-lg py-2 block hover:text-brand-gold transition-colors" onClick={() => setMobileMenuOpen(false)}>
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
              <Link to={link.path} key={link.name} className="hover:text-brand-gold transition-colors">
                {link.name}
              </Link>
            ))}

            {/* Cart and Auth Links */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative hover:text-brand-gold transition-colors">
                <ShoppingBag />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-brand-gold/90 text-brand-purple hover:bg-brand-gold">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-brand-purple/20">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name || user?.email}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      {user?.isAdmin && (
                        <div className="mt-1 text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded inline-block">
                          Administrator
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center cursor-pointer text-red-500 hover:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login" className="hover:text-brand-gold transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="text-black bg-brand-gold hover:bg-brand-gold/90 px-3 py-1 rounded-md transition-colors">
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
