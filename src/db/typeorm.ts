import { createConnection } from 'typeorm/browser'
import { Coords } from '../models/coords'
import { Image } from '../models/image'
import { Marker } from '../models/marker'

export const managerPromise = createConnection({
  type: 'expo',
  driver: require('expo-sqlite'),
  database: 'db.sqlite',
  synchronize: true,
  entities: [Marker, Image, Coords]
}).then(connection => connection.manager)
