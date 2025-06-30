"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import type { google } from "googlemaps"

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: string | null
  google: typeof google | null
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
  google: null,
})

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error("useGoogleMaps must be used within GoogleMapsProvider")
  }
  return context
}

interface GoogleMapsProviderProps {
  children: React.ReactNode
  apiKey: string
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [googleInstance, setGoogleInstance] = useState<typeof google | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey || "YOUR_GOOGLE_MAPS_API_KEY", // En producción usar variable de entorno
      version: "weekly",
      libraries: ["places", "geometry", "directions"],
      language: "es",
      region: "CL",
    })

    loader
      .load()
      .then(() => {
        setGoogleInstance(window.google)
        setIsLoaded(true)
        setLoadError(null)
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error)
        setLoadError("Error al cargar Google Maps. Verifica tu API key.")
        setIsLoaded(false)
      })
  }, [apiKey])

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        loadError,
        google: googleInstance,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  )
}
