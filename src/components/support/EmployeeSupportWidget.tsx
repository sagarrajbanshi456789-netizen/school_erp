'use client'

import { useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'

interface EmployeeSupportWidgetProps {
  className?: string
}

export default function EmployeeSupportWidget({ className }: EmployeeSupportWidgetProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${className ?? 'fixed bottom-4 right-4 z-50'}`}>
      
      {/* Chat Box */}
      {open && (
        <div className="mb-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
            <span className="font-medium">Support</span>
            <button onClick={() => setOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* Messages / Content */}
          <div className="p-3 flex-1 overflow-y-auto text-sm text-gray-800 dark:text-gray-200">
            <p>Hi! How can we help you today?</p>
          </div>

          {/* Input / Action */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        title="Support"
      >
        <FiMessageCircle size={24} />
      </button>
    </div>
  )
}