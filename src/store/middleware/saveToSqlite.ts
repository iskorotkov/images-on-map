import { AnyAction, MiddlewareAPI } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { EntityManager } from 'typeorm/browser'
import { hydrate } from '../../db/hydrate'
import { managerPromise } from '../../db/typeorm'
import { Coords } from '../../models/coords'
import { Image } from '../../models/image'
import { Marker } from '../../models/marker'

export const saveToSqlite = (api: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: any) => {
  const res = next(action)
  console.debug('middleware invoked with state', JSON.stringify(api.getState()))

  const models = hydrateState(api)
  console.debug('hydrated models')
  ;(async () => {
    const manager = await managerPromise
    await deleteExtraMarkers(models, manager)
    await saveFullState(manager, models)
  })()

  return res
}

const hydrateState = (api: MiddlewareAPI) =>
  api.getState().markers.map((snapshot: Marker) =>
    hydrate(Marker, {
      ...snapshot,
      images: snapshot.images.map(image => hydrate(Image, image)),
      location: hydrate(Coords, snapshot.location)
    })
  ) as Marker[]

const saveFullState = async (manager: EntityManager, models: Marker[]) => {
  await manager.save(models)
  console.debug('saved to db', JSON.stringify(models))
}

const deleteExtraMarkers = async (models: Marker[], manager: EntityManager) => {
  const idsToDelete = models.map(marker => marker.id).join(', ')
  console.debug('deleting all except for', idsToDelete)

  const deleted = await manager
    .createQueryBuilder()
    .delete()
    .from(Marker)
    .where('id not in (:idsToDelete)', { idsToDelete })
    .execute()
  console.debug('deleted', deleted.affected)
}
