import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import ACAccounts from './pages/ACAccounts'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="ac" element={<ACAccounts />} />
      </Route>
    </Routes>
  )
}
