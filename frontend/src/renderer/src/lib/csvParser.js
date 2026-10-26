import Papa from "papaparse"

/** 
 * Splits semicolon/comma-separated strings inside a CSV cell --> a trimmed array
 * Example: "AP Calc, Precalc" --> ["AP Calc", "Precalc"]
*/
function parseList(value) {
    if (!value) return []
    if (Array.isArray(value)) return value

    return value
        .split(/[;,]/) // Split by ; and ,
        .map((item) => item.trim()) // Trim each item
        .filter((item) => item.length > 0) // Drop empty strings
}

/**
 * Purpose: Parses teachers.csv
 * 
 * Expected Input (an example of CSV row):
 * {
 *      "id": string,
 *      "courses-teaching" OR "courses": string,
 *      "periods-available" OR "periods": string,
 *      "max-teach": string/number
 * }
 * 
 * Expected Output (this is an example of one object; this function outputs an ARRAY of objects):
 * {
 *   "id": string,
 *   "courses-teaching": string[],
 *   "periods-available": string[],
 *   "max-teach": number
 * }
 */
export function parseTeacherCSV(file) { // TODO: figure out the 2 problems (min-class and max-class stuff, + default vals)
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true, // Header is the column names at the top
            skipEmptyLines: true,
            error: (err) => reject(err), // If it fails to read the file itself
            complete: (results) => {
                try {
                    const parsedArray = results.data.map((row) => {
                        const id = String(row.id ?? "").trim()
                        const coursesTeaching = parseList(row["courses-teaching"] || row.courses_teaching || row.courses || "") // Supports hyphenated, snake_case, or short names
                        const periodsAvailable = parseList(row["periods-available"] || row.periods_available || row.periods || "") // Supports hyphenated, snake_case, or short names
                        const rawMaxTeach = String(row["max-teach"] ?? row.max_teach ?? "").trim()

                        const maxTeach = (rawMaxTeach !== "" ? parseInt(rawMaxTeach, 10) : periodsAvailable.length) // If it's empty (they don't care), use the amt of periods

                        return {
                            id,
                            "courses-teaching": coursesTeaching,
                            "periods-available": periodsAvailable,
                            "max-teach": maxTeach
                        }
                    })

                    resolve(parsedArray)

                } catch (err) {
                    reject(new Error("Failed to transform teachers data: " + err.message))
                }
            }
        })
    })
}

/**
 * Purpose: Parses courses.csv
 * 
 * Expected Input (an example of CSV row):
 * {
 *   "name": string,
 *   "duration": string/number,
 *   "min-class" OR "min": string/number,
 *   "max-class" OR "max": string/number,
 *   "pref-size" OR "pref": string/number,
 *   "maximum-classes" OR "max-classes": string/number
 * }
 * 
 * Expected Output (this is an example of one object; this function outputs an ARRAY of objects):
 *   {
 *     "name": string,
 *     "duration": number,
 *     "min-class": number,
 *     "max-class": number,
 *     "pref-size": number,
 *     "maximum-classes": number
 *   }
 */
export function parseCourseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            error: (err) => reject(err),
            complete: (results) => {
                try {
                    const parsedArray = results.data.map((row) => {
                        const name = String(row.name ?? "").trim()
                        const duration = parseInt(row.duration || row.length || "2", 10) // Course length is in semesters (2 = full year)
                        const minClass = parseInt(row["min-class"] || row.min_size || row.min, 10) // Min students required to avoid class cancellation
                        const maxClass = parseInt(row["max-class"] || row.max_size || row.max, 10) // Max capacity for a class
                        const prefSize = parseInt(row["pref-size"] || row.pref_size || row.pref, 10) // Target size
                        const maxClasses = parseInt(row["maximum-classes"] || row.max_classes || row["max-classes"], 10)

                        return {
                            name,
                            duration,
                            "min-class": minClass,
                            "max-class": maxClass,
                            "pref-size": prefSize,
                            "maximum-classes": maxClasses
                        }
                    })

                    resolve(parsedArray)

                } catch (err) {
                    reject(new Error("Failed to transform courses data: " + err.message))
                }
            }
        })
    })
}

/**
 * Purpose: Parses students.csv
 * 
 * Expected Input (example of CSV row):
 * {
 *   "id": string,
 *   "name": string, // (optional, for UI display)
 *   "required-courses" OR "required": string,
 *   "electives": string
 * }
 * 
 * Expected Output:
 * {
 *   solverPayload: [ // Goes to backend
 *     {
 *       "id": string,
 *       "required-courses": string[],
 *       "electives": string[]
 *     }
 *   ],
 *   idToNameMap: {
 *     [studentId: string]: string // ID -> Name; this is for UI display
 *   }
 * }
 */
export function parseStudentCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            error: (err) => reject(err),
            complete: (results) => {
                try {
                    const idToNameMap = {} // ID -> Name

                    const solverPayload = results.data.map((row) => {
                        const id = String(row.id ?? "").trim()
                        const name = String(row.name ?? "").trim() || `Student ${id}` // If name is found, use it; otherwise fall back to "Student 97591" for ex
                        if (id) idToNameMap[id] = name

                        const requiredCourses = parseList(row["required-courses"] || row.required_courses || row.required || "")
                        const electives = parseList(row.electives || "") // Preserves it in the same order

                        return {
                            id,
                            "required-courses": requiredCourses,
                            electives
                        }
                    })

                    resolve({solverPayload, idToNameMap})

                } catch (err) {
                    reject(new Error("Failed to transform students data: " + err.message))
                }
            }
        })
    })
}