import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function StudentsTable({ data = [] }) {
  if (!data.length) {
    return (
      <div className="table-empty-state">
        No student records loaded yet. Upload a CSV above to preview data.
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <Table className="data-table">
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Required Courses</TableHead>
            <TableHead>Electives</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student, idx) => {
            const studentId = student.id?.toString().trim()
            const requiredList = Array.isArray(student.required)
              ? student.required
              : student.required
                ? student.required.split(";").map((s) => s.trim()).filter(Boolean) // Line provided by Gemini 3.5
                : []
            const electivesList = Array.isArray(student.electives)
              ? student.electives
              : student.electives
                ? student.electives.split(";").map((s) => s.trim()).filter(Boolean)
                : []

            return (
              <TableRow key={studentId || idx}>
                <TableCell className="row-primary-title">{studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <div className="badge-group">
                    {requiredList.map((req) => (
                      <Badge key={req} variant="outline" className="table-chip">{req}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="badge-group">
                    {electivesList.map((elec, priorityIdx) => (
                      <Badge key={elec} variant="outline" className="table-chip">
                        {priorityIdx + 1}. {elec} {/*Ex: 5. Cybersecurity*/}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
