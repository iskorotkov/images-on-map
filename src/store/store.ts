import { configureStore } from '@reduxjs/toolkit'
import { hydrate } from '../db/hydrate'
import { managerPromise } from '../db/typeorm'
import { Coords } from '../models/coords'
import { Image } from '../models/image'
import { Marker } from '../models/marker'
import { markersReducer } from './markersReducer'

export const store = configureStore({
  reducer: {
    markers: markersReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api => next => action => {
      const res = next(action)
      console.debug('middleware invoked with state', JSON.stringify(api.getState()))

      const models = api.getState().markers.map((snapshot: Marker) =>
        hydrate(Marker, {
          ...snapshot,
          images: snapshot.images.map(image => hydrate(Image, image)),
          location: hydrate(Coords, snapshot.location)
        })
      ) as Marker[]

      console.debug('hydrated models')
      ;(async () => {
        const manager = await managerPromise

        const idsToDelete = models.map(marker => marker.id).join(', ')
        console.debug('deleting all except for', idsToDelete)

        const deleted = await manager
          .createQueryBuilder()
          .delete()
          .from(Marker)
          .where('id not in (:idsToDelete)', { idsToDelete })
          .execute()
        console.debug('deleted', deleted.affected)

        await manager.save(models)
        console.debug('saved to db', JSON.stringify(models))
      })()

      return res
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
