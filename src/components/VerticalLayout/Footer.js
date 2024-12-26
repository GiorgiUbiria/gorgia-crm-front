import React from "react"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {currentYear} Gorgia. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
