import { useState } from 'react'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null)

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Hostel Room Allocation System</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => { setIsLoggedIn(true); setUserRole('student') }}>
            Login as Student
          </button>
          <button onClick={() => { setIsLoggedIn(true); setUserRole('admin') }}>
            Login as Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hostel Room Allocation System</h1>
      <p>Welcome, {userRole}!</p>
      {userRole === 'student' && (
        <div>
          <h2>Student Dashboard</h2>
          <button>Apply for Hostel</button>
          <button>View Application Status</button>
        </div>
      )}
      {userRole === 'admin' && (
        <div>
          <h2>Admin Dashboard</h2>
          <button>View Applications</button>
          <button>Allocate Rooms</button>
        </div>
      )}
      <button onClick={() => { setIsLoggedIn(false); setUserRole(null) }} style={{ marginTop: '2rem' }}>
        Logout
      </button>
    </div>
  )
}
