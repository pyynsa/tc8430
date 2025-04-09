import app from './app.js'
import http from 'node:http'
import config from './utils/config.js'

const server = http.createServer(app)

server.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`)
})