import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

export const studentsDataContext = React.createContext<any>({})
export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveStudents, saveData, saveState] = useApi<{ students: any }>({ url: "save-roll" })
  const [getActivity, activityData, activityState] = useApi<{ students: any }>({ url: "get-activities" })

  const [updatedData, setUpdatedData] = useState<any>()
  const [sortType, setSortType] = useState("")

  const [update, setUpdate] = useState(false)
  const [attendanceData, setAttendanceData] = useState({ total: data?.students.length, present: 0, absent: 0, late: 0 })

  const calculateAttendance = () => {
    const totalCount = data?.students.length
    let present = 0,
      absent = 0,
      late = 0
    if (totalCount) {
      for (let i = 0; i < totalCount; i++) {
        console.log("insideloop")
        if (data?.students[i].status === "present") present++
        if (data?.students[i].status === "absent") absent++
        if (data?.students[i].status === "late") late++
      }
    }
    setAttendanceData({ total: totalCount, present: present, absent: absent, late: late })
  }

  const sendSnapshot = () => {
    const rollInput = data?.students.map((student: any) => {
      return {
        id: student.id,
        name: student.first_name + " " + student.last_name,
        completed_at: new Date(),
        student_roll_states: {
          student_id: student.id,
          roll_state: student.status,
        },
      }
    })

    saveStudents(rollInput)
  }
  const searchStudents = (e: any) => {
    const studentName = e.target.value.replace(/ /g, "")
    const filteredStudents = data?.students.filter((student) => {
      const name = student.first_name + student.last_name

      return name.toLowerCase().includes(studentName.toLowerCase())
    })
    setUpdatedData(filteredStudents)
    setUpdate(true)
    sortData("true")
    setSortType("search")
  }

  const sortByRollState = (rollState: string) => {
    if (rollState === "all") {
      const dataCopy = data?.students
      setUpdatedData(dataCopy)
      setUpdate(true)
      return
    }
    if (data != undefined) {
      const dataCopy = data?.students
      const sortedData = [...dataCopy].filter((student) => {
        return student.status === rollState
      })
      setUpdatedData(sortedData)
      setUpdate(true)
      setSortType("roll")
    }
  }
  const sortData = (type: string) => {
    setUpdate(true)
    //using sort-type as the updated data contains the data now and is not null and we have to work on
    //sorting the updated data and not the data
    //spread operator is used to create a deep copy
    if (sortType === "roll" || sortType === "search") {
      if (type === "sort_asc") {
        const dataCopy = updatedData

        const sortedData = [...dataCopy].sort((a: any, b: any) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name))
        setUpdatedData(sortedData)
      }

      if (type === "sort_desc") {
        const dataCopy = updatedData
        const sortedData = [...dataCopy].sort((a, b) => (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name))

        setUpdatedData(sortedData)
      }
      return
    } else {
      if (type === "sort_asc") {
        if (data != undefined) {
          const dataCopy = data.students
          const sortedData = [...dataCopy]?.sort((a, b) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name))
          setUpdatedData(sortedData)
        }
      }

      if (type === "sort_desc") {
        if (data != undefined) {
          const dataCopy = data.students
          const sortedData = [...dataCopy].sort((a, b) => (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name))

          setUpdatedData(sortedData)
        }
      }
    }
  }

  useEffect(() => {
    if (loadState === "loading") void getStudents()
    calculateAttendance()
  }, [getStudents, data?.students.length, saveStudents])

  const startClicked = (val: string) => {
    if (val === "roll") {
      setIsRollMode(true)
    }
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "sort_asc" || "sort_desc") {
      sortData(action)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "complete") {
      setIsRollMode(false)
      sendSnapshot()
    } else if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <studentsDataContext.Provider value={{ data, calAttendance: calculateAttendance, sortRoll: sortByRollState }}>
        <S.PageContainer>
          <Toolbar onStartClick={startClicked} onItemClick={onToolbarAction} searchStudents={searchStudents} />

          {loadState === "loading" && (
            <CenteredContainer>
              <FontAwesomeIcon icon="spinner" size="2x" spin />
            </CenteredContainer>
          )}

          {loadState === "loaded" && data?.students && !update && (
            <>
              {data.students.map((s: any) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
              ))}
            </>
          )}

          {loadState === "loaded" && updatedData && update && (
            <>
              {updatedData?.map((s: any) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
              ))}
            </>
          )}

          {loadState === "error" && (
            <CenteredContainer>
              <div>Failed to load</div>
            </CenteredContainer>
          )}
        </S.PageContainer>

        <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} attendanceData={attendanceData} />
      </studentsDataContext.Provider>
    </>
  )
}

type ToolbarAction = "roll" | "sort_asc" | "sort_desc"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onStartClick: (val: string) => void

  searchStudents: (e: any) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onStartClick } = props
  const [searchField, setSearchField] = useState<string>("Search")
  const [type, setType] = useState<string>("sort_asc")

  const onSortClick = () => {
    if (type === "sort_asc") {
      onItemClick(type)
      setType("sort_desc")
    }

    if (type === "sort_desc") {
      onItemClick(type)
      setType("sort_asc")
    }
  }

  return (
    <S.ToolbarContainer>
      <div onClick={() => onSortClick()} style={{ cursor: "pointer" }}>
        First Name
      </div>
      <input type="search" placeholder="Search" onChange={(e) => props.searchStudents(e)} />

      <S.Button onClick={() => onStartClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
