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

export default function TeachersTable({ data = [] }) {
  if (!data.length) {
    return (
      <div className="table-empty-state">
        No teacher records loaded yet. Upload a CSV above to preview data.
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <Table className="data-table">
        <TableHeader>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Courses Teaching</TableHead>
            <TableHead>Periods Available</TableHead>
            <TableHead>Max Courses Teaching</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((teacher, idx) => (
            <TableRow key={teacher.id || idx}>
                <TableCell className="teacher-id">{teacher.id}</TableCell>
                <TableCell>
                  <div className="badge-group">
                    {teacher.courses?.map((c) => (
                      <Badge key={c} variant="outline" className="table-chip">{c}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="badge-group">
                    {teacher.periods?.map((p) => (
                      <Badge key={p} variant="outline" className="table-chip period-chip">{p}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="table-chip">{teacher.maxLoad || 5}</Badge>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}