export interface Person {
  id?: number
  first_name: string
  last_name: string
  photo_url?: string
  //attendance?: string | undefined
  attendanceStatus?: Attendance[] | undefined
  status?: string
  color?: string
}

export interface Attendance {
  id: string
  status: string
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}
