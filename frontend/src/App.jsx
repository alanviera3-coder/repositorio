import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import KanbanPage from './pages/KanbanPage'
import ListPage from './pages/ListPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<KanbanPage />} />
        <Route path="lista" element={<ListPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
