import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import * as serviceWorker from "./serviceWorkerRegistration"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// @ts-ignore
window.deferredPrompt = null
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault()
  // @ts-ignore
  window.deferredPrompt = e
})

window.addEventListener("appinstalled", () => {
  // @ts-ignore
  window.deferredPrompt = null
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.Fragment>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.Fragment>
)

serviceWorker.register({
  onUpdate: registration => {
    const shouldRefresh = window.confirm(
      "ახალი ვერსია უკვე ხელმისაწვდომია. გსურთ გადატვირთვა?"
    )
    if (shouldRefresh) {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" })
      }
      window.location.reload()
    }
  },
  onSuccess: () => {
    console.log("Service Worker registered successfully")
  },
})
