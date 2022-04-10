import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { studentsDataContext } from "../../daily-care/home-board.page"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  id?: number
}

export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, id }) => {
  const [rollState, setRollState] = useState(initialState)
  const { data, calAttendance } = React.useContext(studentsDataContext)

  const [val, setVal] = useState("list")

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]

    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    const index = data?.students.findIndex((student: any) => student.id === id)
    data.students[index].status = next

    if (next === "present") {
      data.students[index].color = "#13943b"
    } else if (next === "absent") {
      data.students[index].color = "#9b9b9b"
    } else if (next === "late") {
      data.students[index].color = "#f5a623"
    } else {
      data.students[index].color = "#fff"
    }

    setVal("list")
    calAttendance()

    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} iconType={val} size={size} onClick={onClick} data={data} id={id} />
}
