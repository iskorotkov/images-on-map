import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Image } from '../../models/image'
import { Marker } from '../../models/marker'
import { AsyncThunkConfig, RootState } from '../store'
import axios from 'axios'
import Constants from 'expo-constants'

type MarkersState = Marker[]

const initialState: MarkersState = []

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    replaceState: (state, action: PayloadAction<MarkersState>) => action.payload,
    addMarker: (state, action: PayloadAction<Marker>) => [...state, action.payload],
    removeMarker: (state, action: PayloadAction<string>) => state.filter(_ => _.id !== action.payload),
    renameMarker: (state, action: PayloadAction<{ id: string; name: string }>) =>
      state.map(_ => (_.id === action.payload.id ? { ..._, name: action.payload.name } : _)),
    addImage: (state, action: PayloadAction<{ id: string; image: Image }>) =>
      state.map(_ => (_.id === action.payload.id ? { ..._, images: [..._.images, action.payload.image] } : _)),
    removeImage: (state, action: PayloadAction<{ id: string; imageId: string }>) =>
      state.map(_ =>
        _.id === action.payload.id ? { ..._, images: _.images.filter(_ => _.id !== action.payload.imageId) } : _
      )
  }
})

export const markersReducer = markersSlice.reducer

export const { replaceState } = markersSlice.actions

const { addMarker, removeMarker, renameMarker, addImage, removeImage } = markersSlice.actions

export const selectMarkers = (state: RootState) => state.markers

export const selectMarkerById = (id: string) => (state: RootState) => state.markers.filter(_ => _.id === id)[0]

const apiBaseUrl = Constants.manifest!.extra!.apiBaseUrl

export const fetchMarkersThunk = createAsyncThunk('markers/fetch', async (_, { dispatch }) => {
  try {
    const resp = await axios.get<Marker[]>(apiBaseUrl + '/')
    console.log('got markers from server', JSON.stringify(resp.data))
    dispatch(replaceState(resp.data))
  } catch {
    alert('Error fetching markers from server')
  }
})

export const addMarkerThunk = createAsyncThunk<void, Marker>('markers/add', async (marker, { dispatch }) => {
  dispatch(addMarker(marker))
  try {
    await axios.post(apiBaseUrl + '/', marker)
  } catch {
    dispatch(removeMarker(marker.id))
    alert('Error adding marker')
  }
})

export const removeMarkerThunk = createAsyncThunk<void, string, AsyncThunkConfig>(
  'markers/remove',
  async (id, { dispatch, getState }) => {
    const deleted = selectMarkerById(id)(getState())

    dispatch(removeMarker(id))
    try {
      await axios.delete(apiBaseUrl + '/' + id)
    } catch {
      dispatch(addMarker(deleted))
      alert('Error removing marker')
    }
  }
)

export const renameMarkerThunk = createAsyncThunk<void, { id: string; name: string }, AsyncThunkConfig>(
  'markers/rename',
  async ({ id, name }, { dispatch, getState }) => {
    const old = selectMarkerById(id)(getState())

    dispatch(renameMarker({ id, name }))

    const updated = selectMarkerById(id)(getState())
    try {
      await axios.put(apiBaseUrl + '/' + id, updated)
    } catch {
      dispatch(renameMarker(old))
      alert('Error renaming marker')
    }
  }
)

export const addImageThunk = createAsyncThunk<void, { id: string; image: Image }, AsyncThunkConfig>(
  'markers/addImage',
  async ({ id, image }, { dispatch, getState }) => {
    dispatch(addImage({ id, image }))

    const updated = selectMarkerById(id)(getState())
    try {
      await axios.put(apiBaseUrl + '/' + id, updated)
    } catch {
      dispatch(removeImage({ id, imageId: image.id }))
      alert('Error adding image to marker')
    }
  }
)

export const removeImageThunk = createAsyncThunk<void, { id: string; image: Image }, AsyncThunkConfig>(
  'markers/removeImage',
  async ({ id, image }, { dispatch, getState }) => {
    dispatch(removeImage({ id, imageId: image.id }))

    const updated = selectMarkerById(id)(getState())
    try {
      await axios.put(apiBaseUrl + '/' + id, updated)
    } catch {
      dispatch(addImage({ id, image }))
      alert('Error removing image from marker')
    }
  }
)
