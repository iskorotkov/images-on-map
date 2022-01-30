import { Coords } from './coords'
import { Image } from './image'

export interface Marker {
  id: string
  name: string
  location: Coords
  images: Image[]
}
