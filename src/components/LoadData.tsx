import { memo, useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { fetchMarkersThunk } from '../store/reducers/markersReducer'

export const LoadData = memo(() => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchMarkersThunk())
  }, [dispatch])

  return <></>
})
