import { prisma } from "@/lib/prisma"
import AddEmployeeDialog from "@/components/employee/AddEmployeeDialog"
import EditEmployeeDialog from "@/components/employee/EditEmployeeDialog"
import DeleteEmployeeDialog from "@/components/employee/DeleteEmployeeDialog"
import { Prisma } from "@/app/generated/prisma/browser"

type Props = {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function EmployeesPage({ searchParams }: Props) {

  const params = await searchParams

  const search = params?.search || ""
  const page = Number(params?.page || 1)
  const pageSize = 5
  const where: Prisma.UserWhereInput = {
    role: "EMPLOYEE",
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ],
  }
  const [employees, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Employees</h1>

        <div className="flex gap-3">
          <form method="GET">
            <input
              name="search"
              placeholder="Search..."
              defaultValue={search}
              className="border px-3 py-2 rounded w-48"
            />
          </form>


          <AddEmployeeDialog />
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Device</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Seen</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>


            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50">

                    {/* Employee Info */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        {emp.name?.charAt(0).toUpperCase() || "E"}
                      </div>

                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-gray-500 text-xs">{emp.email}</p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-3">
                      {emp.phone || <span className="text-gray-400">N/A</span>}
                    </td>

                    {/* Location */}
                    <td className="p-3">
                      {emp.location || <span className="text-gray-400">Unknown</span>}
                    </td>

                    {/* Device */}
                    <td className="p-3 flex items-center gap-2">
                      {emp.device === "Mobile" && "📱"}
                      {emp.device === "Windows" && "💻"}
                      {emp.device === "Mac" && "🖥️"}
                      {emp.device || "—"}
                    </td>


                    {/* Online Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${emp.isOnline
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {emp.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* Last Seen */}
                    <td className="p-3 text-sm text-gray-600">
                      {emp.lastSeen
                        ? new Date(emp.lastSeen).toLocaleString()
                        : "Never"}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right space-x-3">
                      <EditEmployeeDialog employee={emp} />
                      <DeleteEmployeeDialog id={emp.id} />
                    </td>

                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="space-x-2">
          {page > 1 && (
            <a
              href={`?search=${search}&page=${page - 1}`}
              className="px-3 py-1 border rounded"
            >
              Prev
            </a>
          )}

          {page < totalPages && (
            <a
              href={`?search=${search}&page=${page + 1}`}
              className="px-3 py-1 border rounded"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
