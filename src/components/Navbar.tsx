
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
                  <>
                    <div className="py-2 border-t mt-2">
                      <p className="text-gray-500 text-sm">Signed in as</p>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
