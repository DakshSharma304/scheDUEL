import { useState } from "react"
import TopNavbar from "@/components/TopNavbar"
import BottomActionBar from "@/components/BottomActionBar"
import DataInputView from "@/components/DataInputView"
import IssuesConflictsView from "@/components/IssuesConflictsView"
import ScheduleView from "@/components/ScheduleView"
import { parseCsvFile } from "../../utils/csv"
import {
  addStudentNames,
  DEFAULT_PERIODS,
  generateSchedule,
} from "../../utils/scheduleApi"
import "./style.css"

export default function App() {
  const [activeTab, setActiveTab] = useState("input") // Which tab user is on
  const [systemStatus, setSystemStatus] = useState("Ready")
  const [isSolving, setIsSolving] = useState(false)
  const [scheduleOutput, setScheduleOutput] = useState(null)

  const [filesData, setFilesData] = useState({ // Populate these as we get the data from the user
    teachers: { fileName: null, rows: [], backendRows: [] },
    courses: { fileName: null, rows: [], backendRows: [] },
    students: { fileName: null, rows: [], backendRows: [] },
  })

  /** Parse the CSV and store the UI rows vs backend rows respectively and correctly */
  const handleFileUpload = async (type, file) => {
    const parsed = await parseCsvFile(file)
    setFilesData((prev) => ({ ...prev, [type]: parsed }))
  }

  /** Sends the backend rows (data) to the API, updating the UI while its running */
  const handleGenerate = async (timeLimit) => {
    setIsSolving(true)
    setSystemStatus("Solving...")

    try {
      const schedule = await generateSchedule({
        teachers: filesData.teachers.backendRows,
        courses: filesData.courses.backendRows,
        students: filesData.students.backendRows,
        periods: DEFAULT_PERIODS,
        maxTime: timeLimit,
      })
      setScheduleOutput(addStudentNames(schedule, filesData.students.rows))
      setActiveTab("viewer")
      setSystemStatus("Ready")
    } catch (error) {
      console.error("Schedule generation failed:", error)
      setSystemStatus(error.message)
    } finally {
      setIsSolving(false)
    }
  }

  return (
    <div className="app-shell">
      {/* Nav Bar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      {/* Content */}
      <main className="app-main">
        {activeTab === "input" && (
          <DataInputView
            filesData={filesData}
            onFileUpload={handleFileUpload}
          />
        )}
        {activeTab === "viewer" && (
          <ScheduleView scheduleData={scheduleOutput} />
        )}
        {activeTab === "issues" && (
          <IssuesConflictsView issues={scheduleOutput?.issues || []} />
        )}
      </main>

      {/* Action Bar (bottom) */}
      {activeTab === "input" && (
        <BottomActionBar
          teachersLoaded={filesData.teachers.rows.length > 0} // Note: i'm not going to validate every little thing!!
          coursesLoaded={filesData.courses.rows.length > 0}
          studentsLoaded={filesData.students.rows.length > 0}
          onGenerate={handleGenerate}
          isSolving={isSolving}
        />
      )}
    </div>
  )
}