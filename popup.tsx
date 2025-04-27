import { useState } from "react"

export default function Popup() {
  const [status, setStatus] = useState<string | null>(null)

  const startSelecting = async () => {
    setStatus("Activating…")

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })
    if (!tab?.id) {
      setStatus("No active tab")
      return
    }

    // Inject all the picker logic inline:
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        let hoverEl = null
        let overlay = null

        const showToast = (msg) => {
          const t = document.createElement("div")
          Object.assign(t.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 12px",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            borderRadius: "4px",
            zIndex: "1000000",
            pointerEvents: "none"
          })
          t.textContent = msg
          document.body.append(t)
          setTimeout(() => t.remove(), 2000)
        }

        const cleanup = () => {
          document.removeEventListener("mouseover", onMouseOver, true)
          document.removeEventListener("click", onClick, true)
          overlay && overlay.remove()
        }

        function onMouseOver(e) {
          overlay && overlay.remove()
          hoverEl = e.target
          overlay = document.createElement("div")
          Object.assign(overlay.style, {
            position: "absolute",
            pointerEvents: "none",
            background: "rgba(255,0,0,0.2)",
            outline: "2px solid red",
            zIndex: "999999"
          })
          document.body.append(overlay)
          const r = hoverEl.getBoundingClientRect()
          Object.assign(overlay.style, {
            top: `${r.top+window.scrollY}px`,
            left: `${r.left+window.scrollX}px`,
            width: `${r.width}px`,
            height: `${r.height}px`
          })
        }

        function onClick(e) {
          e.preventDefault()
          e.stopPropagation()
          if (!hoverEl) return cleanup()

          const text = hoverEl.innerText.trim()
          navigator.clipboard.writeText(text)
            .then(() => showToast(`Copied: "${text.slice(0,30)}…"`) )
            .catch(() => showToast("Copy failed"))

          cleanup()
        }

        document.addEventListener("mouseover", onMouseOver, true)
        document.addEventListener("click", onClick, true)
      }
    })

    setStatus("Click any element to copy…")
  }

  return (
    <div style={{ width: 280, padding: 16, fontFamily: "sans-serif" }}>
      <h4>SnapClip</h4>
      <button onClick={startSelecting} style={{ width: "100%", padding: 8 }}>
        Select &amp; Copy
      </button>
      {status && <p style={{ marginTop: 12, color: "#555" }}>{status}</p>}
    </div>
  )
}
