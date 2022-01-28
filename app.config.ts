import 'dotenv/config'

export default {
  nameInput: 'Images on Map',
  version: '1.0.0',
  extra: {
    googleMapApiKey: process.env.GOOGLE_MAP_API_KEY
  }
}
