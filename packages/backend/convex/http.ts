import { httpRouter } from 'convex/server'
import { auth } from './auth'

const http: any = httpRouter()

auth.addHttpRoutes(http)

export default http
