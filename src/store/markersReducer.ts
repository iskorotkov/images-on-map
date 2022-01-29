import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Marker } from '../models/marker'
import { RootState } from './store'

type MarkersState = Marker[]

const initialState: MarkersState = []

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    addMarker: (state, action: PayloadAction<Marker>) => [...state, action.payload],
    removeMarker: (state, action: PayloadAction<Marker>) => state.filter(_ => _ !== action.payload),
    renameMarker: (state, action: PayloadAction<{ id: string; name: string }>) =>
      state.map(_ => (_.id === action.payload.id ? { ..._, name: action.payload.name } : _)),
    addImage: (state, action: PayloadAction<{ id: string; image: string }>) =>
      state.map(_ => (_.id === action.payload.id ? { ..._, images: [..._.images, action.payload.image] } : _)),
    removeImage: (state, action: PayloadAction<{ id: string; image: string }>) =>
      state.map(_ =>
        _.id === action.payload.id ? { ..._, images: _.images.filter(_ => _ !== action.payload.image) } : _
      )
  }
})

export const markersReducer = markersSlice.reducer

export const { addMarker, removeMarker, renameMarker, addImage, removeImage } = markersSlice.actions

export const selectMarkers = (state: RootState) => state.markers

export const selectMarkerById = (id: string) => (state: RootState) => state.markers.filter(_ => _.id === id)[0]
