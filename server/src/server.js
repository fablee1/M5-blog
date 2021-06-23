import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import { catchErrorMiddleware, badRequestMiddleware, notFoundMiddleware } from "./errorMiddlewares.js"

const port = 3001
const server = express()

const logger = (req, res, next) => {
  console.log(`New Request --> ${req.method} ${req.url} -- ${new Date()}`)
  next()
}

server.use(cors())
server.use(express.json())
server.use(logger)

server.use("/authors", authorsRouter)
server.use("/posts", postsRouter)

server.use(notFoundMiddleware)
server.use(badRequestMiddleware)
server.use(catchErrorMiddleware)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server is running on port " + port)
})