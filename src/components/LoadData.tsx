import { memo, useEffect } from 'react'
import { dehydrate } from '../db/hydrate'
import { managerPromise } from '../db/typeorm'
import { Marker } from '../models/marker'
import { useAppDispatch } from '../store/hooks'
import { replaceState } from '../store/reducers/markersReducer'

export const LoadData = memo(() => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      const manager = await managerPromise
      const markers = await manager.find(Marker, { relations: ['images'] })
      console.debug('loaded data', JSON.stringify(markers))
      dispatch(replaceState(dehydrate(markers)))
    })()
  }, [dispatch])

  return <></>
})
