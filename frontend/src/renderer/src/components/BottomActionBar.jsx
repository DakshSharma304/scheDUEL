import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function BottomActionBar({teachersLoaded = false, coursesLoaded = false, studentsLoaded = false, onGenerate, isSolving = false}) {
  const [timeLimit, setTimeLimit] = useState(1800) // Max selected solver runtime (ex, 30 min demo)
  const canGenerate = teachersLoaded && coursesLoaded && studentsLoaded

  return (
    <footer className="bottom-action-bar">
      <div className="bottom-action-status">
        <span className="bottom-action-label">Files:</span>
        <Badge
          variant="outline"
          className={teachersLoaded ? "badge-ready" : "badge-missing"}
        >
          Teachers: {teachersLoaded ? "Ready!" : "Missing"}
        </Badge>

        <Badge
          variant="outline"
          className={coursesLoaded ? "badge-ready" : "badge-missing"}
        >
          Courses: {coursesLoaded ? "Ready!" : "Missing"}
        </Badge>

        <Badge
          variant="outline"
          className={studentsLoaded ? "badge-ready" : "badge-missing"}
        >
          Students: {studentsLoaded ? "Ready!" : "Missing"}
        </Badge>
      </div>

      <div className="bottom-action-controls">
        <select
          className="solver-time-select"
          value={timeLimit}
          disabled={!canGenerate || isSolving}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
        >
          <option value={30}>Max Time: 30 seconds - Demo</option>
          <option value={1800}>
            Max Time: 30 minutes - Recommended for smaller schools
          </option>
          <option value={7200}>
            Max Time: 2 hours - Recommended for medium schools
          </option>
          <option value={0}>
            Max Time: Until optimal - Recommended for larger schools
          </option>
        </select>

        <Button
          disabled={!canGenerate || isSolving}
          onClick={() => onGenerate(timeLimit)}
        >
          {isSolving ? "Generating Schedules..." : "Generate Schedules"}
        </Button>
      </div>
    </footer>
  )
}