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

export default function CoursesTable({ data = [] }) {
  if (!data.length) {
    return (
      <div className="table-empty-state">
        No course records loaded yet. Upload a CSV above to preview data.
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <Table className="data-table">
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Duration (Semesters)</TableHead>
            <TableHead>Min Size</TableHead>
            <TableHead>Preferred Size</TableHead>
            <TableHead>Max Size</TableHead>
            <TableHead>Max Classes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((course, idx) => {
            const min = Number(course.minClass ?? course["min-class"]) || 0
            const pref = Number(course.prefSize ?? course["pref-size"]) || 0
            const max = Number(course.maxClass ?? course["max-class"]) || 0
            const maxClasses =
              course.maxClasses ??
              course["maximum-classes"] ??
              course.maxClasses

            return (
              <TableRow key={course.name || course.id || idx}>
                <TableCell className="row-primary-title">{course.name}</TableCell>
                <TableCell><Badge variant="outline" className="table-chip">{course.duration}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="table-chip">{min}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="table-chip">{pref}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="table-chip">{max}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="table-chip">{maxClasses}</Badge></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
