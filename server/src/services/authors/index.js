import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

import createError from "http-errors"
import { validationResult } from "express-validator"
import { authorsValidation } from "../authors/validation.js"

const authorsRouter = express.Router()

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")

const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
const writeAuthors = (content) => fs.writeFileSync(authorsJSONPath, JSON.stringify(content)) 

authorsRouter.get("/", (req, res, next) => {
  try {
    res.send(getAuthors())
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:id", (req, res, next) => {
  try {
    const users = getAuthors()
    const user = users.find(u => u._id === req.params.id)
    if(user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/", authorsValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
      const avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
      const newUser = { ...req.body, _id: uniqid(), createdAt: new Date(), avatar: avatar}
      const users = getAuthors()
      if(users.some(user => user.email === req.body.email)){
        res.status(400).send({error: "Email already registered"})
      } else {
        users.push(newUser)
        writeAuthors(users)
        res.status(201).send({ _id: newUser._id })
      }
    } else {
      next(createError(400, { errorsList: errors }))
    }

  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:id", (req, res, next) => {
  try {
    const users = getAuthors()
    const targetUserIndex = users.findIndex(user => user._id === req.params.id)
    const targetUser = users[targetUserIndex]
    if(targetUser) {
      users[targetUserIndex] = { ...targetUser, ...req.body }
      writeAuthors(users)
      res.status(200).send(users[targetUserIndex])
    } else {
      res.status(400).send({error: "author does not exist"})
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:id", (req, res, next) => {
  try {
    const users = getAuthors()
    const remainingUsers = users.filter(user => user._id !== req.params.id)
    writeAuthors(remainingUsers)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/checkEmail", (req, res, next) => {
  try {
    const users = getAuthors()
    if(users.some(user => user.email === req.body.email)){
      res.status(201).send({exists: true})
    } else {
      res.status(201).send({exists: false})
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter