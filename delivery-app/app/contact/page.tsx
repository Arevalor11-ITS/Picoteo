"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Mail, Clock, MapPin, Send } from "lucide-react"
import Navigation from "@/components/navigation"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se enviaría el formulario
    alert("Mensaje enviado correctamente. Te contactaremos pronto.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      content: "+56 9 1234 5678",
      description: "Llámanos para pedidos urgentes",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contacto@deliverypremium.cl",
      description: "Escríbenos tus consultas",
    },
    {
      icon: Clock,
      title: "Horarios",
      content: "Lun - Dom: 10:00 - 23:00",
      description: "Horario de atención y delivery",
    },
    {
      icon: MapPin,
      title: "Cobertura",
      content: "Región Metropolitana",
      description: "Delivery en toda la ciudad",
    },
  ]

  const subjects = [
    "Consulta sobre productos",
    "Problema con pedido",
    "Sugerencias",
    "Reclamos",
    "Solicitud de cotización",
    "Otro",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Contáctanos
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario de Contacto */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800">Envíanos un mensaje</CardTitle>
                <CardDescription>Completa el formulario y te responderemos a la brevedad</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Asunto</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <div className="space-y-6">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Información de Contacto</CardTitle>
                  <CardDescription>Múltiples formas de comunicarte con nosotros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-800">{info.title}</h3>
                          <p className="text-lg font-medium text-gray-900">{info.content}</p>
                          <p className="text-sm text-gray-600">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">¿Cuál es el tiempo de entrega?</h4>
                      <p className="text-sm text-gray-600">
                        Nuestro tiempo promedio de entrega es de 30-45 minutos, dependiendo de la ubicación.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">¿Hay costo de envío?</h4>
                      <p className="text-sm text-gray-600">
                        El costo de envío varía según la distancia. Consulta al hacer tu pedido.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">¿Qué formas de pago aceptan?</h4>
                      <p className="text-sm text-gray-600">
                        Aceptamos transferencias bancarias y tarjetas de crédito/débito.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
