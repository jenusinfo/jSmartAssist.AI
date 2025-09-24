import DocumentManagement from '../components/admin/DocumentManagement'

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <DocumentManagement />
    </div>
  )
}