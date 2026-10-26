import React from "react"

export default function ScheduleCard({ id, name, schedule, isTeacher = false }) {
  const sem1 = schedule?.semester1 || []
  const sem2 = schedule?.semester2 || []
  const periodCount = Math.max(sem1.length, sem2.length)

  const renderSemester = (semester, semesterNumber) => (
    <div className="semester-column">
      <div className="semester-heading">Semester {semesterNumber}</div>
      <div className="period-list">
        {Array.from({ length: periodCount }, (_, idx) => { // Line given by Gemini 3.5
          const periodLabel = `P${idx + 1}`
          const course = semester[idx]

          return (
            <div key={`${semesterNumber}-${periodLabel}`} className="period-row">
              <span className="period-label">{periodLabel}</span>
              <span className="period-course">{course || ""}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="schedule-card">
      <div className="schedule-card-header">
        <span className="schedule-card-title">
          {name ? `${name} (${id})` : id}
        </span>
      </div>

      <div className="schedule-semesters-row">
        {renderSemester(sem1, 1)}
        {renderSemester(sem2, 2)}
      </div>
    </div>
  )
}
