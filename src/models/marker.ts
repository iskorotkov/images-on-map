import { Coords } from './coords'

export interface Marker {
  id: string
  name: string
  location: Coords
  images: string[]
}
