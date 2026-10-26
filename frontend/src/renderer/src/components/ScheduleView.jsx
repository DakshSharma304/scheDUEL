import React, { useState } from "react"
import ScheduleCard from "@/components/ScheduleCard"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ScheduleView({ scheduleData }) {
  const [viewMode, setViewMode] = useState("students") // which sub-tab it's on
  const [searchQuery, setSearchQuery] = useState("")
  const isTeacher = viewMode === "teachers"
  const schedulesMap = scheduleData // Selects either student-schedules or teacher-schedules bc of which view it's on
    ? (isTeacher
        ? scheduleData["teachers-schedules"]
        : scheduleData["students-schedules"]) || {}
    : {}
  const query = searchQuery.trim().toLowerCase()
  const filteredEntries = Object.entries(schedulesMap).filter(([id, data]) => { // Gemini 3.5 helped with finding out how to code this line
    const matchesId = id.toLowerCase().includes(query)
    const matchesName = data.name?.toLowerCase().includes(query)
    return matchesId || matchesName
  })

  return (
    <section className="schedule-viewer-container">
      <div className="schedule-controls-bar">
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList className="segmented-toggle">
            <TabsTrigger value="students" className="toggle-option">
              Students View
            </TabsTrigger>
            <TabsTrigger value="teachers" className="toggle-option">
              Teachers View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="schedule-search-box">
          <Input
            type="text"
            placeholder={
              viewMode === "students"
                ? "Search by student name or ID"
                : "Search by teacher ID"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="schedule-grid">
        {filteredEntries.length === 0 ? (
          <div className="table-empty-state">
            {scheduleData
              ? "No matching schedules found."
              : "No schedules generated yet. Go to Data Input and click 'Generate Schedules'."}
          </div>
        ) : (
          filteredEntries.map(([id, schedule]) => (
            <ScheduleCard
              key={id}
              id={id}
              name={schedule.name}
              schedule={schedule}
              isTeacher={isTeacher}
            />
          ))
        )}
      </div>
    </section>
  )
}