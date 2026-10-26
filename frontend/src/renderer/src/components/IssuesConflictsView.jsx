import React from "react"

const ISSUE_DESCRIPTIONS = {
  41: {
    title: "No Feasible Schedule",
    description:
      "We could not fit all student elective requests/courses, resulting in study halls being forced on some students.",
  },
}

export default function IssuesConflictsView({ issues = [41] }) {
  const totalIssues = issues.length // Note.. for now it's only rlly gonna be one TYPE of issue (error 41)

  return (
    <section className="issues-view-container">
      <div className="issues-header-bar">
        <span className="issues-header-title">Scheduling Issues</span>
      </div>

      <div className="issues-list-container">
        {totalIssues === 0 ? (
          <div className="table-empty-state">
            No scheduling conflicts detected; all schedule conflicts solved successfully.
          </div>
        ) : (
          issues.map((code, idx) => {
            const issueInfo = ISSUE_DESCRIPTIONS[code] || {
              title: "Scheduling Issue",
              description: "An unexpected solver condition occurred.",
            }

            return (
              <div key={`${code}-${idx}`} className="issue-card">
                <div className="issue-card-header">
                  <span className="issue-card-title">{issueInfo.title}</span>
                </div>
                <div className="issue-card-body">
                  <p className="issue-card-desc">{issueInfo.description}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
