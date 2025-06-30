"use client"

import { useState, useCallback } from "react"
import { useGoogleMaps } from "@/components/google-maps-provider"

interface GeocodeResult {
  address: string
  location: {
    lat: number
    lng: number
  }
  placeId: string
  formattedAddress: string
}

export function useGoogleMapsGeocoding() {
  const { google, isLoaded } = useGoogleMaps()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const geocodeAddress = useCallback(
    async (address: string): Promise<GeocodeResult | null> => {
      if (!google || !isLoaded) {
        setError("Google Maps no está cargado")
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const geocoder = new google.maps.Geocoder()

        return new Promise((resolve, reject) => {
          geocoder.geocode(
            {
              address: address,
              region: "CL", // Priorizar resultados de Chile
            },
            (results, status) => {
              setIsLoading(false)

              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const result = results[0]
                const location = result.geometry.location

                resolve({
                  address: address,
                  location: {
                    lat: location.lat(),
                    lng: location.lng(),
                  },
                  placeId: result.place_id,
                  formattedAddress: result.formatted_address,
                })
              } else {
                const errorMessage = `Error de geocodificación: ${status}`
                setError(errorMessage)
                reject(new Error(errorMessage))
              }
            },
          )
        })
      } catch (err) {
        setIsLoading(false)
        const errorMessage = "Error al geocodificar la dirección"
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    [google, isLoaded],
  )

  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<string | null> => {
      if (!google || !isLoaded) {
        setError("Google Maps no está cargado")
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const geocoder = new google.maps.Geocoder()

        return new Promise((resolve, reject) => {
          geocoder.geocode(
            {
              location: { lat, lng },
            },
            (results, status) => {
              setIsLoading(false)

              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                resolve(results[0].formatted_address)
              } else {
                const errorMessage = `Error de geocodificación inversa: ${status}`
                setError(errorMessage)
                reject(new Error(errorMessage))
              }
            },
          )
        })
      } catch (err) {
        setIsLoading(false)
        const errorMessage = "Error al obtener la dirección"
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    [google, isLoaded],
  )

  return {
    geocodeAddress,
    reverseGeocode,
    isLoading,
    error,
  }
}
