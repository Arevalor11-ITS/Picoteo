"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, X } from "lucide-react"

export default function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)

      // Mostrar prompt si no se ha decidido aún
      if (Notification.permission === "default") {
        // Esperar un poco antes de mostrar el prompt
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowPrompt(false)

      if (result === "granted") {
        // Mostrar notificación de bienvenida
        new Notification("¡Notificaciones activadas!", {
          body: "Te mantendremos informado sobre el estado de tus pedidos",
          icon: "/icon-192x192.png",
        })
      }
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  if (!showPrompt || permission !== "default") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-amber-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-800 flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Notificaciones
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={dismissPrompt} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">Recibe actualizaciones en tiempo real sobre tus pedidos</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button size="sm" onClick={requestPermission} className="bg-amber-600 hover:bg-amber-700 text-xs">
              Activar
            </Button>
            <Button size="sm" variant="outline" onClick={dismissPrompt} className="text-xs bg-transparent">
              Ahora no
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
