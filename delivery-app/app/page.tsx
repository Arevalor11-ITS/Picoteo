"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wine, Coffee, MapPin, Clock, Star, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import OrderStatusWidget from "@/components/order-status-widget"

export default function HomePage() {
  const [cartItems, setCartItems] = useState(0)

  const featuredProducts = [
    {
      id: 1,
      name: "Tabla Premium",
      description: "Selección de quesos, jamones y frutos secos",
      price: 25000,
      image: "/placeholder.svg?height=200&width=300",
      category: "tabla",
    },
    {
      id: 2,
      name: "Pisco Sour Premium",
      description: "Preparado con pisco premium y limón fresco",
      price: 8000,
      image: "/placeholder.svg?height=200&width=300",
      category: "trago",
    },
    {
      id: 3,
      name: "Vino Tinto Reserva",
      description: "Cabernet Sauvignon de valle central",
      price: 15000,
      image: "/placeholder.svg?height=200&width=300",
      category: "licor",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation cartItems={cartItems} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Reuniones inolvidables,
            <br />
            <span className="text-amber-200">sabores insuperables</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">
            Delivery de bebidas premium y tablas gourmet a domicilio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/drinks">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
                <Wine className="mr-2 h-5 w-5" />
                Ver Tragos y Licores
              </Button>
            </Link>
            <Link href="/snacks">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 bg-transparent"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Ver Tablas y Picoteo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-amber-200">
              <CardHeader>
                <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-800">Delivery Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Entrega en 30-45 minutos en toda la ciudad</p>
              </CardContent>
            </Card>

            <Card className="text-center border-amber-200">
              <CardHeader>
                <Star className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-800">Calidad Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Productos seleccionados y preparados por expertos</p>
              </CardContent>
            </Card>

            <Card className="text-center border-amber-200">
              <CardHeader>
                <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle className="text-amber-800">Cobertura Amplia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Servicio disponible en toda el área metropolitana</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Productos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-amber-200">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-amber-800">{product.name}</CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {product.category}
                    </Badge>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">${product.price.toLocaleString()}</span>
                    <Button
                      onClick={() => setCartItems((prev) => prev + 1)}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para tu próxima reunión?</h2>
          <p className="text-xl mb-8 text-amber-100">Haz tu pedido ahora y recibe todo lo necesario en tu puerta</p>
          <Link href="/drinks">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
              Hacer Pedido Ahora
            </Button>
          </Link>
        </div>
      </section>
      <OrderStatusWidget />
    </div>
  )
}
