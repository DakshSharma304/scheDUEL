const API_BASE_URL = "http://127.0.0.1:48217"
export const DEFAULT_PERIODS = 8 // It'll always be this

/** Matches student IDs from backend with names from the CSV */
export function addStudentNames(schedule, students) {
  const namesById = Object.fromEntries(
    students.map((student) => [String(student.id), student.name]),
  )

  return {
    ...schedule,
    "students-schedules": Object.fromEntries(
      Object.entries(schedule["students-schedules"] || {}).map(
        ([studentId, studentSchedule]) => [
          studentId,
          {
            ...studentSchedule,
            name: namesById[String(studentId)] || undefined,
          },
        ],
      ),
    ),
  }
}

/** Sends the data to backend API & validates response */
export async function generateSchedule({
  teachers,
  courses,
  students,
  periods = DEFAULT_PERIODS,
  maxTime,
}) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      teachers,
      courses,
      students,
      periods,
      max_time: maxTime,
    }),
  })

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const detail =
      responseBody && typeof responseBody.detail === "string"
        ? responseBody.detail
        : `Backend request failed with status ${response.status}.`
    throw new Error(detail)
  }

  if (!responseBody || typeof responseBody !== "object") {
    throw new Error("Backend returned an invalid schedule response.")
  }

  if (!["OPTIMAL", "FEASIBLE"].includes(responseBody.status)) {
    throw new Error(`Solver returned ${responseBody.status}. No schedule was generated.`)
  }

  return responseBody
}
