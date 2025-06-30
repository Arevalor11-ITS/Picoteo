"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { useGoogleMaps } from "./google-maps-provider"

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, location: { lat: number; lng: number }) => void
  placeholder?: string
  label?: string
  defaultValue?: string
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Ingresa tu dirección...",
  label = "Dirección",
  defaultValue = "",
}: AddressAutocompleteProps) {
  const { google, isLoaded } = useGoogleMaps()
  const inputRef = useRef<HTMLInputElement>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [inputValue, setInputValue] = useState(defaultValue)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!google || !isLoaded || !inputRef.current) return

    // Configurar autocompletado de Google Places
    const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "cl" }, // Restringir a Chile
      fields: ["formatted_address", "geometry", "name", "place_id"],
    })

    // Configurar listener para cuando se selecciona una dirección
    autocompleteInstance.addListener("place_changed", () => {
      setIsLoading(true)
      const place = autocompleteInstance.getPlace()

      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }

        const address = place.formatted_address || place.name || ""
        setInputValue(address)
        onAddressSelect(address, location)
      }
      setIsLoading(false)
    })

    setAutocomplete(autocompleteInstance)

    // Cleanup
    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance)
      }
    }
  }, [google, isLoaded, onAddressSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="address-input" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={!isLoaded}
          className="pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      {!isLoaded && <p className="text-xs text-gray-500">Cargando autocompletado de direcciones...</p>}
    </div>
  )
}
