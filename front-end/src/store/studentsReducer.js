const initialState = {
  students: [],
}

const studentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "POPULATE_STUDENTS":
      console.log("populated")
      return { ...state, students: action.payload.data.students }
    case "PRESENT":
      return

    case "LATE":
      return

    case "ABSENT":
      return

    default:
      return state
  }
}

export default studentsReducer
