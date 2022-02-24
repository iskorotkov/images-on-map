import { memo, useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { fetchMarkersThunk, replaceState } from '../store/reducers/markersReducer'
import { managerPromise } from '../db/typeorm'
import { dehydrate } from '../db/hydrate'
import { Marker } from '../models/marker'

export const LoadData = memo(() => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      try {
        await dispatch(fetchMarkersThunk())
      } catch {
        const manager = await managerPromise
        const markers = await manager.find(Marker, { relations: ['images'] })

        console.debug('loaded data from db', JSON.stringify(markers))
        dispatch(replaceState(dehydrate(markers)))
      }
    })()
  }, [dispatch])

  return <></>
})
