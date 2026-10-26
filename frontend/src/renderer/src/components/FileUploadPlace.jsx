import React, { useRef } from "react"
import { Button } from "@/components/ui/button"

export default function FileUploadPlace({fileType, fileName, onFileSelected}) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] // (Using ? in case it's null)
    if (file && onFileSelected) {
      onFileSelected(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-place">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="upload-file-input"
        onChange={handleFileChange}
      />

      {fileName ? (
        // File is already loaded
        <div className="upload-place-loaded">
          <span>
            Loaded: <strong>{fileName}</strong>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="upload-replace-btn"
            onClick={handleBrowseClick}
          >
            Replace file
          </Button>
        </div>
      ) : (
        // If it's empty
        <div className="upload-place-empty" onClick={handleBrowseClick}>
          <span>
            Drag & drop <strong>{fileType}.csv</strong> here, or{" "}
            <span className="upload-browse-text">Click to browse</span>
          </span>
        </div>
      )}
    </div>
  )
}