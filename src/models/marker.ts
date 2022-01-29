import { Coords } from 'google-map-react'

export interface Marker {
  id: string
  name: string
  location: Coords
  images: string[]
}
