let hoverEl: Element | null = null
let overlay: HTMLDivElement | null = null

// Draw red overlay on hover
function onMouseOver(e: MouseEvent) {
  if (overlay) overlay.remove()
  hoverEl = e.target as Element

  overlay = document.createElement("div")
  Object.assign(overlay.style, {
    position: "absolute",
    pointerEvents: "none",
    background: "rgba(255,0,0,0.2)",
    outline: "2px solid red",
    zIndex: "999999"
  })
  document.body.append(overlay)

  const rect = hoverEl.getBoundingClientRect()
  Object.assign(overlay.style, {
    top: `${rect.top + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`
  })
}

// Compute a simple unique selector
function getUniqueSelector(el: Element): string {
  if (el.id) return `#${el.id}`
  const path: string[] = []
  let curr: Element | null = el
  while (curr && curr.tagName.toLowerCase() !== "html") {
    const tag = curr.tagName.toLowerCase()
    const siblings = Array.from(curr.parentElement?.children || []).filter(
      (x) => x.tagName === curr!.tagName
    )
    const idx =
      siblings.length > 1
        ? `:nth-of-type(${siblings.indexOf(curr) + 1})`
        : ""
    path.unshift(`${tag}${idx}`)
    curr = curr.parentElement
  }
  return path.join(" > ")
}

// On click: copy text, show toast, then cleanup
function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!hoverEl) {
    cleanup()
    return
  }

  const el = hoverEl as HTMLElement
  const text = el.innerText.trim()

  // Copy to clipboard
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast(`Copied: "${truncate(text, 30)}"`)
    })
    .catch(() => {
      showToast("Copy failed")
    })

  cleanup()
}

// Tear down listeners & overlay
function cleanup() {
  document.removeEventListener("mouseover", onMouseOver, true)
  document.removeEventListener("click", onClick, true)
  overlay?.remove()
  overlay = null
  hoverEl = null
}

// Simple toast notification
function showToast(msg: string) {
  const toast = document.createElement("div")
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px 12px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    borderRadius: "4px",
    zIndex: "1000000",
    fontSize: "14px",
    pointerEvents: "none"
  })
  toast.textContent = msg
  document.body.append(toast)
  setTimeout(() => toast.remove(), 2000)
}

// Helper to truncate for the toast
function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "…" : str
}

// Listen for the “startSelect” command from popup
chrome.runtime.onMessage.addListener((message, _sender) => {
  if (message.type === "startSelect") {
    document.addEventListener("mouseover", onMouseOver, true)
    document.addEventListener("click", onClick, true)
  }
})