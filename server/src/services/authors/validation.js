import { body } from "express-validator"

export const authorsValidation = [
  body("name").exists().withMessage("Name is a mandatory field!"),
  body("surname").exists().withMessage("Surname is a mandatory field!"),
  body("email").exists().withMessage("Email is a mandatory field!").isEmail().withMessage("Email should be a valid one!"),
  body("dob").exists().withMessage("DOB is a mandatory field!").isDate().withMessage("Date should be a valid one!"),
]