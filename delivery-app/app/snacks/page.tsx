"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coffee, Search, ShoppingCart, Filter, Users } from "lucide-react"
import Navigation from "@/components/navigation"

export default function SnacksPage() {
  const [cartItems, setCartItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sizeFilter, setSizeFilter] = useState("all")

  const products = [
    {
      id: 1,
      name: "Tabla Premium",
      description: "Selección de quesos importados, jamones ibéricos, frutos secos y mermeladas artesanales",
      price: 25000,
      size: "large",
      serves: "4-6 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
      ingredients: ["Queso manchego", "Jamón ibérico", "Nueces", "Mermelada de higos"],
    },
    {
      id: 2,
      name: "Tabla Clásica",
      description: "Quesos nacionales, jamón serrano, aceitunas y crackers gourmet",
      price: 18000,
      size: "medium",
      serves: "3-4 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
      ingredients: ["Queso gouda", "Jamón serrano", "Aceitunas", "Crackers"],
    },
    {
      id: 3,
      name: "Tabla Vegetariana",
      description: "Selección de quesos, frutas frescas, frutos secos y dips vegetales",
      price: 20000,
      size: "medium",
      serves: "3-4 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
      ingredients: ["Quesos variados", "Frutas de estación", "Hummus", "Frutos secos"],
    },
    {
      id: 4,
      name: "Picoteo Ejecutivo",
      description: "Mini empanadas, croquetas, aceitunas rellenas y salsas gourmet",
      price: 15000,
      size: "small",
      serves: "2-3 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
      ingredients: ["Mini empanadas", "Croquetas", "Aceitunas rellenas", "Salsas"],
    },
    {
      id: 5,
      name: "Tabla Familiar",
      description: "Gran selección para compartir: quesos, carnes frías, frutas y acompañamientos",
      price: 35000,
      size: "xlarge",
      serves: "6-8 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
      ingredients: ["Variedad de quesos", "Carnes frías", "Frutas", "Panes artesanales"],
    },
    {
      id: 6,
      name: "Tabla Dulce",
      description: "Chocolates premium, frutas, frutos secos y dulces artesanales",
      price: 22000,
      size: "medium",
      serves: "3-4 personas",
      image: "/placeholder.svg?height=200&width=300",
      available: false,
      ingredients: ["Chocolates", "Frutas frescas", "Macarons", "Frutos secos"],
    },
  ]

  const sizeFilters = [
    { value: "all", label: "Todos los tamaños" },
    { value: "small", label: "Pequeña (2-3 personas)" },
    { value: "medium", label: "Mediana (3-4 personas)" },
    { value: "large", label: "Grande (4-6 personas)" },
    { value: "xlarge", label: "Familiar (6-8 personas)" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSize = sizeFilter === "all" || product.size === sizeFilter
    return matchesSearch && matchesSize
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
            <Coffee className="h-8 w-8" />
            Picoteo y Tablas
          </h1>

          {/* Filtros */}
          <Card className="mb-8 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar tablas y picoteo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <Select value={sizeFilter} onValueChange={setSizeFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeFilters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.label}
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
                    <Badge variant="outline" className="text-amber-700 border-amber-300 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {product.serves}
                    </Badge>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-amber-800 mb-2">Incluye:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-700">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
              <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o cambia el filtro de tamaño</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
