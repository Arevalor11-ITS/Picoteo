"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, CreditCard, Package } from "lucide-react"
import Navigation from "@/components/navigation"

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "",
    rut: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: "",
  })

  const [orders] = useState([
    {
      id: "001",
      date: "2024-01-15",
      total: 45000,
      status: "Entregado",
      items: ["Tabla Premium", "Vino Tinto Reserva"],
    },
    {
      id: "002",
      date: "2024-01-10",
      total: 28000,
      status: "Entregado",
      items: ["Pisco Sour x2", "Tabla Clásica"],
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Aquí se guardarían los datos del perfil
    alert("Perfil actualizado correctamente")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
            <User className="h-8 w-8" />
            Mi Cuenta
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Perfil Personal */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Actualiza tus datos personales y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={profile.rut}
                      onChange={(e) => handleInputChange("rut", e.target.value)}
                      placeholder="12.345.678-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Av. Principal 123, Depto 45"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Santiago"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Región</Label>
                    <Input
                      id="region"
                      value={profile.region}
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      placeholder="Metropolitana"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>

            {/* Historial de Pedidos */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Historial de Pedidos
                </CardTitle>
                <CardDescription>Revisa tus pedidos anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-amber-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-amber-800">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${order.total.toLocaleString()}</p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{order.status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Productos: {order.items.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métodos de Pago */}
          <Card className="mt-8 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
              <CardDescription>Gestiona tus formas de pago preferidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">Transferencia Bancaria</h3>
                  <p className="text-sm text-gray-600">Pago directo a cuenta bancaria con confirmación automática</p>
                </div>
                <div className="border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">Tarjetas de Crédito/Débito</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard y otras tarjetas principales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
