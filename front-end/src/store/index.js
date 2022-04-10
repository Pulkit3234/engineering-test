import { combineReducers } from "redux"
import { studentsReducer } from "./studentsReducer"

const rootReducer = {
  students: studentsReducer,
}

export default rootReducer
