import { Router } from "express"
import uniqid from "uniqid"

import createError from "http-errors"
import { validationResult } from "express-validator"
import { postsValidation } from "../../middlewares/validation/postsValidation.js"
import { readFile, findById, writeFile } from "../../utils/file-utils.js"

const postsRouter = Router()

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await readFile("posts.json")
    res.send(posts)
  } catch (error) {
    next(error)
  }
})

postsRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await findById(req.params.id, "posts.json")
    res.send(post)
  } catch (error) {
    next(error)
  }
})

postsRouter.post("/", postsValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const author = getAuthors().find((a) => a._id === req.body.author)
      console.log(getAuthors())
      const newPost = {
        ...req.body,
        _id: uniqid(),
        createdAt: new Date(),
        author: author,
      }
      const posts = getPosts()
      posts.push(newPost)
      writePosts(posts)
      res.status(201).send({ _id: newPost._id })
    } else {
      next(createError(400, { errorsList: errors }))
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.put("/:id", (req, res, next) => {
  try {
    const posts = getPosts()
    const targetPostIndex = posts.findIndex((p) => p._id === req.params.id)
    const targetPost = posts[targetPostIndex]
    if (targetPost) {
      posts[targetPostIndex] = { ...targetpost, ...req.body }
      writePosts(posts)
      res.status(200).send(posts[targetPostIndex])
    } else {
      res.status(400).send({ error: "post does not exist" })
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const posts = await readFile("posts.json")
    const remainingPosts = posts.filter((p) => p._id !== req.params.id)
    await writeFile("posts.json", remainingPosts)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default postsRouter
