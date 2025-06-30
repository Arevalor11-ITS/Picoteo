"use client"

import { useState, useEffect, useCallback } from "react"

interface TrackingData {
  orderId: string
  status: string
  location?: { lat: number; lng: number }
  estimatedTime: string
  lastUpdate: string
}

export function useRealTimeTracking(orderId: string) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectToTracking = useCallback(() => {
    // En una implementación real, esto sería una conexión WebSocket
    // Por ahora simulamos con polling

    const simulateRealTimeUpdates = () => {
      const mockData: TrackingData = {
        orderId,
        status: ["confirmed", "preparing", "ready", "in_transit", "delivered"][Math.floor(Math.random() * 5)],
        location: {
          lat: -33.4489 + (Math.random() - 0.5) * 0.01,
          lng: -70.6693 + (Math.random() - 0.5) * 0.01,
        },
        estimatedTime: `${Math.floor(Math.random() * 30) + 10}-${Math.floor(Math.random() * 30) + 20} min`,
        lastUpdate: new Date().toISOString(),
      }

      setTrackingData(mockData)
      setIsConnected(true)
      setError(null)
    }

    // Simular conexión inicial
    setTimeout(() => {
      simulateRealTimeUpdates()
    }, 1000)

    // Simular actualizaciones periódicas
    const interval = setInterval(simulateRealTimeUpdates, 15000)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [orderId])

  useEffect(() => {
    const cleanup = connectToTracking()
    return cleanup
  }, [connectToTracking])

  const sendNotification = useCallback((message: string) => {
    // En una implementación real, esto enviaría notificaciones push
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("DeliveryPremium", {
        body: message,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
      })
    }
  }, [])

  // Simular notificaciones cuando cambia el estado
  useEffect(() => {
    if (trackingData) {
      const statusMessages = {
        confirmed: "Tu pedido ha sido confirmado",
        preparing: "Estamos preparando tu pedido",
        ready: "Tu pedido está listo para envío",
        in_transit: "Tu pedido está en camino",
        delivered: "Tu pedido ha sido entregado",
      }

      const message = statusMessages[trackingData.status as keyof typeof statusMessages]
      if (message) {
        sendNotification(message)
      }
    }
  }, [trackingData, sendNotification])

  return {
    trackingData,
    isConnected,
    error,
    reconnect: connectToTracking,
  }
}
