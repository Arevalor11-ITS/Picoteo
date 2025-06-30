"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, User, Wine, Coffee, MessageCircle, MapPin, ShoppingCart, Menu, Package } from "lucide-react"

interface NavigationProps {
  cartItems?: number
}

export default function Navigation({ cartItems = 0 }: NavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/account", label: "Mi Cuenta", icon: User },
    { href: "/orders", label: "Mis Pedidos", icon: Package },
    { href: "/drinks", label: "Tragos y Licores", icon: Wine },
    { href: "/snacks", label: "Picoteo / Tabla", icon: Coffee },
    { href: "/contact", label: "Contáctanos", icon: MessageCircle },
    { href: "/location", label: "Ubicación", icon: MapPin },
  ]

  const NavLink = ({ href, label, icon: Icon, mobile = false }: any) => (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        pathname === href ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
      } ${mobile ? "w-full justify-start" : ""}`}
      onClick={() => mobile && setIsOpen(false)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )

  return (
    <nav className="bg-white shadow-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Wine className="h-8 w-8 text-amber-600" />
            <span className="text-xl font-bold text-amber-800">DeliveryPremium</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                {cartItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} mobile />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
