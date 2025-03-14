
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
    <nav className="bg-gradient-to-r from-brand-purple to-purple-700 text-white py-4 shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand with Animation */}
        <Link to="/" className="text-2xl font-bold flex items-center transition-all duration-300 hover:scale-105">
          <span className="text-brand-gold drop-shadow-md">The</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">Perfect</span>
          <span className="text-brand-gold drop-shadow-md">Shoppe</span>
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-brand-purple/80 animate-pulse">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gradient-to-b from-brand-light to-white border-r-brand-purple p-6">
              <div className="grid gap-4">
                <div className="mb-8">
                  <Link to="/" className="text-xl font-bold flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-brand-gold">The</span>Perfect<span className="text-brand-gold">Shoppe</span>
                  </Link>
                </div>
                
                {navLinks.map((link, index) => (
                  <Link
                    to={link.path}
                    key={link.name}
                    className="text-lg py-2 block hover:text-brand-gold transition-colors transform hover:translate-x-2 duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  to="/cart" 
                  className="text-lg py-2 block hover:text-brand-gold transition-colors transform hover:translate-x-2 duration-200 flex items-center" 
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
                    <button onClick={handleLogout} className="text-lg py-2 text-red-500 flex items-center hover:bg-red-50 px-2 rounded transition-colors">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-lg py-2 block hover:text-brand-gold transition-colors transform hover:translate-x-2 duration-200" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="text-lg py-2 block hover:text-brand-gold transition-colors transform hover:translate-x-2 duration-200" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Navigation Links with Animations */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link 
                to={link.path} 
                key={link.name} 
                className="relative overflow-hidden group py-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="inline-block hover:text-brand-gold transition-colors duration-300">
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}

            {/* Cart and Auth Links */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative hover:text-brand-gold transition-colors duration-300 transform hover:scale-110">
                <ShoppingBag />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-br from-brand-gold to-yellow-500 text-brand-purple hover:from-brand-gold hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 shadow-md">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-brand-purple/20 animate-scale-in">
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
                  <Link to="/login" className="relative group overflow-hidden py-1">
                    <span className="inline-block hover:text-brand-gold transition-colors duration-300">
                      Login
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                  <Link to="/signup" className="text-black bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-400 hover:to-brand-gold px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
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
