/**
 * Reads the CSV file, strips out empty lines, and separates file name from raw the data rows, omitting the header
 */
import {
  parseCourseCSV,
  parseStudentCSV,
  parseTeacherCSV,
} from "../renderer/src/lib/csvParser"

// Removes the p prefix like "p1" and converts it to the actual number (1)
function periodToNumber(period) {
  const value = String(period).trim().replace(/^p/i, "") // Line given straight from Gemini 3.5
  const number = Number(value)
  return Number.isInteger(number) ? number : null
}

// Chooses correct CSV parser block based on its filename, and then converts values to the format FastAPI likes
export async function parseCsvFile(file) {
  if (file.name.toLowerCase() === "teachers.csv") {
    const teachers = await parseTeacherCSV(file)

    return {
      fileName: file.name,
      rows: teachers.map((teacher) => ({
        id: teacher.id,
        courses: teacher["courses-teaching"],
        periods: teacher["periods-available"],
        maxLoad: teacher["max-teach"],
      })),
      backendRows: teachers.map((teacher) => ({
        id: teacher.id,
        courses_teaching: teacher["courses-teaching"],
        periods_available: teacher["periods-available"]
          .map(periodToNumber)
          .filter((period) => period !== null),
        max_teach: teacher["max-teach"],
      })),
    }
  }

  if (file.name.toLowerCase() === "courses.csv") {
    const courses = await parseCourseCSV(file)

    return {
      fileName: file.name,
      rows: courses.map((course) => ({
        name: course.name,
        duration: course.duration,
        minSize: course["min-class"],
        targetSize: course["pref-size"],
        maxSize: course["max-class"],
        maxClasses: course["maximum-classes"],
      })),
      backendRows: courses.map((course) => ({
        name: course.name,
        length: course.duration,
        min_size: course["min-class"],
        max_size: course["max-class"],
        pref_size: course["pref-size"],
        max_classes: course["maximum-classes"],
      })),
    }
  }

  if (file.name.toLowerCase() === "students.csv") {
    const { solverPayload, idToNameMap } = await parseStudentCSV(file)

    return {
      fileName: file.name,
      rows: solverPayload.map((student) => ({
        id: student.id,
        name: idToNameMap[student.id],
        required: student["required-courses"],
        electives: student.electives,
      })),
      backendRows: solverPayload.map((student) => ({
        id: student.id,
        required_courses: student["required-courses"],
        electives: student.electives,
      })),
    }
  }

  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "") // Line given straight from Gemini 3.5

  return {
    fileName: file.name,
    rows: lines.slice(1),
    backendRows: [],
  }
}
