// src/app/admin/dashboard/employees/page.tsx
import { prisma } from "@/lib/prisma"
import AddEmployeeDialog from "@/components/employee/AddEmployeeDialog"
import EditEmployeeDialog from "@/components/employee/EditEmployeeDialog"
import DeleteEmployeeDialog from "@/components/employee/DeleteEmployeeDialog"
import AssignBooksDialog from "@/components/employee/AssignBooksDialog"
import ResetEmployeePasswordDialog from "@/components/employee/ResetEmployeePasswordDialog"
import { Prisma } from "@prisma/client"
import LiveSearch from "./search"

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

  const [employees, publications, assigned, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.publication.findMany(),

    prisma.assignedBook.findMany(),

    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Employees</h1>

        <div className="flex gap-3">
         <LiveSearch defaultValue={search} />

          <AddEmployeeDialog />
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full dark:bg-gray-900 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="p-3">Employee</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Device</th>
                <th className="p-3">Books</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Seen</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {

                  const assignedCount = assigned.filter(
                    (a) => a.employeeId === emp.id
                  ).length

                  const inactive =
                    emp.lastSeen &&
                    Date.now() - new Date(emp.lastSeen).getTime() >
                    7 * 24 * 60 * 60 * 1000

                  return (
                    <tr key={emp.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">

                      {/* Employee */}
                      <td className="p-3 flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                            {emp.name?.charAt(0).toUpperCase() || "E"}
                          </div>
                              <span
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${emp.isOnline ? "bg-green-500" : "bg-gray-400"
                                  }`}
                              />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{emp.name}</p>
                          <p className="text-gray-500 text-xs">{emp.email}</p>
                        </div>
                      </td>

                      {/* Verified */}
                      <td className="p-3 text-xs space-y-1">
                        <div>
                          Email:
                          <span
                            className={`ml-1 px-2 py-0.5 rounded ${emp.emailVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                              }`}
                          >
                            {emp.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>

                        <div>
                          Phone:
                          <span
                            className={`ml-1 px-2 py-0.5 rounded ${emp.phone
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                              }`}
                          >
                            {emp.phone ? "Added" : "Missing"}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3">
                        {emp.phone || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-3">
                        {emp.location || (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>

                      {/* Device */}
                      <td className="p-3 flex items-center gap-2">
                        {emp.device === "Mobile" && "📱"}
                        {emp.device === "Windows" && "💻"}
                        {emp.device === "Mac" && "🖥️"}
                        {emp.device || "—"}
                      </td>

                      {/* Books */}
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {assignedCount} Books
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${emp.isOnline
                              ? "bg-green-100 text-green-700"
                              : inactive
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {emp.isOnline
                            ? "Online"
                            : inactive
                              ? "Inactive"
                              : "Offline"}
                        </span>
                      </td>

                      {/* Last Seen */}
                      <td className="p-3 text-sm text-gray-600">
                        {emp.lastSeen
                          ? new Date(emp.lastSeen).toLocaleString()
                          : "Never"}
                      </td>

                      {/* Created */}
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right space-x-2">

                        <AssignBooksDialog
                          employeeId={emp.id}
                          publications={publications}
                          assigned={assigned
                            .filter(a => a.employeeId === emp.id)
                            .map(a => a.publicationId)
                          }
                        />

                        <ResetEmployeePasswordDialog
                          employeeId={emp.id}
                          employeeName={emp.name || "Employee"}
                        />

                        <EditEmployeeDialog employee={emp} />
                        <DeleteEmployeeDialog id={emp.id} />

                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
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
