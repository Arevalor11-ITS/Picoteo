"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wine, Search, ShoppingCart, Filter } from "lucide-react"
import Navigation from "@/components/navigation"

export default function DrinksPage() {
  const [cartItems, setCartItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const products = [
    {
      id: 1,
      name: "Pisco Sour Premium",
      description: "Preparado con pisco premium, limón fresco y clara de huevo",
      price: 8000,
      category: "cocktail",
      alcohol: "15%",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 2,
      name: "Vino Tinto Reserva",
      description: "Cabernet Sauvignon del valle central, cosecha 2020",
      price: 15000,
      category: "wine",
      alcohol: "13.5%",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 3,
      name: "Whisky Premium",
      description: "Whisky escocés de 12 años, sabor suave y equilibrado",
      price: 45000,
      category: "spirits",
      alcohol: "40%",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 4,
      name: "Mojito Clásico",
      description: "Ron blanco, menta fresca, limón y agua con gas",
      price: 7000,
      category: "cocktail",
      alcohol: "12%",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 5,
      name: "Cerveza Artesanal IPA",
      description: "Cerveza artesanal con lúpulo americano, amargor intenso",
      price: 4500,
      category: "beer",
      alcohol: "6.5%",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 6,
      name: "Gin Tonic Premium",
      description: "Gin premium con tónica artesanal y botánicos frescos",
      price: 9500,
      category: "cocktail",
      alcohol: "18%",
      image: "/placeholder.svg?height=200&width=300",
      available: false,
    },
  ]

  const categories = [
    { value: "all", label: "Todos" },
    { value: "cocktail", label: "Cócteles" },
    { value: "wine", label: "Vinos" },
    { value: "spirits", label: "Destilados" },
    { value: "beer", label: "Cervezas" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const addToCart = (productId: number) => {
    setCartItems((prev) => prev + 1)
    // Aquí se agregaría el producto al carrito
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation cartItems={cartItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
            <Wine className="h-8 w-8" />
            Tragos y Licores
          </h1>

          {/* Filtros */}
          <Card className="mb-8 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar bebidas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow border-amber-200 ${!product.available ? "opacity-60" : ""}`}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive">No Disponible</Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-amber-800">{product.name}</CardTitle>
                    <Badge variant="outline" className="text-amber-700 border-amber-300">
                      {product.alcohol}
                    </Badge>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">${product.price.toLocaleString()}</span>
                    <Button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.available}
                      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Wine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o cambia el filtro de categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
