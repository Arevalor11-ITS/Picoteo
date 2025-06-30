"use client"

import { useState, useEffect, useCallback } from "react"

interface GPSLocation {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
  speed?: number
  heading?: number
}

interface GPSTrackingOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  updateInterval?: number
}

export function useGPSTracking(options: GPSTrackingOptions = {}) {
  const [location, setLocation] = useState<GPSLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 60000, updateInterval = 5000 } = options

  // Verificar soporte de geolocalización
  useEffect(() => {
    setIsSupported("geolocation" in navigator)
  }, [])

  const startTracking = useCallback(() => {
    if (!isSupported) {
      setError("Geolocalización no soportada en este dispositivo")
      return
    }

    setIsTracking(true)
    setError(null)

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords

      setLocation({
        lat: latitude,
        lng: longitude,
        accuracy,
        timestamp: position.timestamp,
        speed: speed || undefined,
        heading: heading || undefined,
      })
      setError(null)
    }

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = "Error desconocido"

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permisos de ubicación denegados"
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Ubicación no disponible"
          break
        case error.TIMEOUT:
          errorMessage = "Tiempo de espera agotado"
          break
      }

      setError(errorMessage)
      setIsTracking(false)
    }

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geoOptions)

    // Configurar seguimiento continuo
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, geoOptions)

    // Configurar intervalo de actualización adicional
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geoOptions)
    }, updateInterval)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearInterval(intervalId)
      setIsTracking(false)
    }
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, updateInterval])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" })
      return permission.state === "granted"
    } catch {
      // Fallback para navegadores que no soportan permissions API
      return new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { timeout: 5000 },
        )
      })
    }
  }, [isSupported])

  return {
    location,
    error,
    isTracking,
    isSupported,
    startTracking,
    stopTracking,
    requestPermission,
  }
}
