import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './Layout.css'

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
