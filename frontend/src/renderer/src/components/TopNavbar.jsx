import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TopNavbar({ activeTab, setActiveTab, systemStatus }) {
  const isReady = systemStatus === "Ready"
  const isSolving = systemStatus === "Solving..."
  const isInfeasible = systemStatus.includes("INFEASIBLE")
  const isError = !isReady && !isSolving
  const statusLabel = systemStatus === "Failed to fetch"
    ? "Backend unavailable"
    : isInfeasible
    ? "Infeasible"
    : systemStatus
  const statusClass = isError
    ? "top-navbar-status-error"
    : isSolving
      ? "top-navbar-status-solving"
      : "top-navbar-status-ready"

  return (
    <header className="top-navbar">
      {/* Title & Status*/}
      <div className="top-navbar-title-group">
        <h1 className="top-navbar-title">scheDUEL</h1>
        <Badge
          variant="outline"
          className={`top-navbar-status ${statusClass}`}
          title={systemStatus}
        >
          ● {statusLabel}
        </Badge>
      </div>

      {/* Nav Bar Tab Buttons */}
      <nav className="top-navbar-nav">
        <Button
          size="sm"
          variant="ghost"
          className={`top-navbar-tab ${activeTab === "input" ? "top-navbar-tab-active" : ""}`}
          onClick={() => setActiveTab("input")}
        >
          Data Input
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={`top-navbar-tab ${activeTab === "viewer" ? "top-navbar-tab-active" : ""}`}
          onClick={() => setActiveTab("viewer")}
        >
          Schedules
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={`top-navbar-tab ${activeTab === "issues" ? "top-navbar-tab-active" : ""}`}
          onClick={() => setActiveTab("issues")}
        >
          Issues/Conflicts
        </Button>
      </nav>
    </header>
  )
}