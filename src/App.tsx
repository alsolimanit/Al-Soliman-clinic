import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function App() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ padding: 20 }}>محتوى التطبيق</main>
      </div>
    </div>
  )
}
