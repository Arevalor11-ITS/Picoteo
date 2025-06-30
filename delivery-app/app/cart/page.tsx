"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Truck } from "lucide-react"
import Navigation from "@/components/navigation"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tabla Premium",
      price: 25000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Pisco Sour Premium",
      price: 8000,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [deliveryCost] = useState(3000)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + deliveryCost

  const handleCheckout = () => {
    if (!deliveryAddress || !paymentMethod) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    // Simulate order creation
    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    alert(`Pedido realizado con éxito. ID: ${orderId}`)

    // Redirect to tracking page
    window.location.href = `/tracking/${orderId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation cartItems={cartItems.length} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Carrito de Compras
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items del Carrito */}
            <div className="lg:col-span-2">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Productos Seleccionados</CardTitle>
                  <CardDescription>Revisa y modifica tu pedido antes de finalizar</CardDescription>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-amber-200 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-amber-800">{item.name}</h3>
                            <p className="text-amber-600 font-bold">${item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumen y Checkout */}
            <div className="space-y-6">
              {/* Resumen del Pedido */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Delivery:
                    </span>
                    <span>${deliveryCost.toLocaleString()}</span>
                  </div>
                  <hr className="border-amber-200" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-amber-600">${total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Entrega */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Información de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección de Entrega</Label>
                    <Input
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Ingresa tu dirección completa"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="payment">Método de Pago</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                        <SelectItem value="credit">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="debit">Tarjeta de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
