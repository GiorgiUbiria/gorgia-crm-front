// src/components/CsrfTokenProvider.jsx
import React, { useEffect } from "react"
import axios from "axios"
import defaultInstance from "plugins/axios"

const CsrfTokenProvider = ({ children }) => {
  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        const response = await defaultInstance.get("/api/csrf-token")

        const metaTag = document.createElement("meta")
        metaTag.setAttribute("name", "csrf-token")
        metaTag.setAttribute("content", response.data.token)
        document.head.appendChild(metaTag)

        axios.defaults.headers.common["X-CSRF-TOKEN"] = response.data.token
      } catch (error) {
        console.error("Error initializing CSRF token:", error)
      }
    }

    initializeCsrf()
  }, [])

  return <>{children}</>
}

export default CsrfTokenProvider
