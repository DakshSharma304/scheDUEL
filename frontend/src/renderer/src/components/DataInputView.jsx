import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import FileUploadPlace from "@/components/FileUploadPlace"
import TeachersTable from "@/components/TeachersTable"
import CoursesTable from "@/components/CoursesTable"
import StudentsTable from "@/components/StudentsTable"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DataInputView({ filesData, onFileUpload }) {
  const [subTab, setSubTab] = useState("teachers")
  const activeFileData = filesData[subTab]
  const teachersCount = filesData.teachers.rows.length
  const coursesCount = filesData.courses.rows.length
  const studentsCount = filesData.students.rows.length

  return (
    <section className="data-input-container">
      <Tabs value={subTab} onValueChange={setSubTab} className="sub-navbar">
        <TabsList variant="line" className="sub-navbar-list">
          <TabsTrigger value="teachers" className="sub-nav-item">
            <span>Teachers</span>
          {teachersCount > 0 && (
            <Badge variant="outline" className="badge-ready">
              {teachersCount} Loaded
            </Badge>
          )}
          </TabsTrigger>

          <TabsTrigger value="courses" className="sub-nav-item">
            <span>Courses</span>
          {coursesCount > 0 && (
            <Badge variant="outline" className="badge-ready">
              {coursesCount} Loaded
            </Badge>
          )}
          </TabsTrigger>

          <TabsTrigger value="students" className="sub-nav-item">
            <span>Students</span>
          {studentsCount > 0 && (
            <Badge variant="outline" className="badge-ready">
              {studentsCount} Loaded
            </Badge>
          )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Upload Place */}
      <FileUploadPlace
        fileType={subTab}
        fileName={activeFileData.fileName}
        onFileSelected={(file) => onFileUpload(subTab, file)}
      />

      {subTab === "teachers" && (
        <TeachersTable data={activeFileData.rows} />
      )}
      {subTab === "courses" && (
        <CoursesTable data={activeFileData.rows} />
      )}
      {subTab === "students" && (
        <StudentsTable data={activeFileData.rows} />
      )}
    </section>
  )
}