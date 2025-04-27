import { useState } from "react"

export default function Popup() {
  const [status, setStatus] = useState<string | null>(null)

  const startSelecting = async () => {
    setStatus("Click any element to copy…")

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })
    if (!tab?.id) {
      setStatus("No active tab")
      return
    }

    // fire off selection mode in content script
    chrome.tabs.sendMessage(tab.id, { type: "startSelect" })
  }

  return (
    <div style={{ width: 280, padding: 16, fontFamily: "sans-serif" }}>
      <h4>SnapClip</h4>
      <button
        onClick={startSelecting}
        style={{ width: "100%", padding: "8px", fontSize: "14px" }}
      >
        Select &amp; Copy
      </button>
      {status && (
        <p style={{ marginTop: 12, fontSize: "13px", color: "#555" }}>
          {status}
        </p>
      )}
    </div>
  )
}
