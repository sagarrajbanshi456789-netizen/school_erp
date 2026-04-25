// src/app/admin/dashboard/employees/page.tsx
import Link from "next/link"
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
type EmployeeWithCount = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: { assignedBooks: true }
    }
  }
}>
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

  // ✅ Fetch employees with count
  
  const [employees, publications, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: { assignedBooks: true },
        },
      },
    }),

    prisma.publication.findMany({
      select: {
        id: true,
        title: true,
        totalPages: true,
      },
    }),

    prisma.user.count({ where }),
  ])

  // ✅ Fetch assigned books ONLY for visible employees
  const assigned = await prisma.assignedBook.findMany({
    where: {
      employeeId: { in: employees.map(e => e.id) },
    },
    select: {
    employeeId: true,
    publicationId: true,
  }
  })
const assignedCount: Record<string, number> = {}

assigned.forEach((a) => {
  if (!assignedCount[a.employeeId]) assignedCount[a.employeeId] = 0
})

const grouped: Record<string, Set<string>> = {}

assigned.forEach((a) => {
  if (!grouped[a.employeeId]) grouped[a.employeeId] = new Set()
  grouped[a.employeeId].add(a.publicationId)
})

Object.keys(grouped).forEach((id) => {
  assignedCount[id] = grouped[id].size
})
  // ✅ Group assigned publications
  const assignedByEmployee = assigned.reduce((acc, a) => {
    if (!acc[a.employeeId]) acc[a.employeeId] = []
    acc[a.employeeId].push(a.publicationId)
    return acc
  }, {} as Record<string, string[]>)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const deviceIcons: Record<string, string> = {
    Mobile: "📱",
    Windows: "💻",
    Mac: "🖥️",
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Employees
        </h1>

        <div className="flex gap-3">
          <LiveSearch defaultValue={search} />
          <AddEmployeeDialog />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-left">
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
                  <td colSpan={10} className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {

                  const inactive =
                    emp.lastSeen &&
                    Date.now() - new Date(emp.lastSeen).getTime() >
                    7 * 24 * 60 * 60 * 1000

                  return (
                    <tr
                      key={emp.id}
                      className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >

                      {/* Employee */}
                      <td className="p-3 flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                            {emp.name?.charAt(0).toUpperCase() || "E"}
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                              emp.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {emp.name}
                          </p>
                          <p className="text-gray-500 text-xs">{emp.email}</p>
                        </div>
                      </td>

                      {/* Verified */}
                      <td className="p-3 text-xs space-y-1">
                        <div>
                          Email:
                          <span
                            className={`ml-1 px-2 py-0.5 rounded ${
                              emp.emailVerified
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {emp.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>

                        <div>
                          Phone:
                          <span
                            className={`ml-1 px-2 py-0.5 rounded ${
                              emp.phone
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {emp.phone ? "Added" : "Missing"}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {emp.phone || <span className="text-gray-400">N/A</span>}
                      </td>

                      {/* Location */}
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        {emp.location || <span className="text-gray-400">Unknown</span>}
                      </td>

                      {/* Device */}
                      <td className="p-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        {deviceIcons[emp.device || ""] || "—"} {emp.device || ""}
                      </td>

                      {/* Books */}
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">
                          {assignedCount[emp.id] ?? 0} Books
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            emp.isOnline
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : inactive
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
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
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {emp.lastSeen
                          ? new Date(emp.lastSeen).toLocaleString()
                          : "Never"}
                      </td>

                      {/* Created */}
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right space-x-2">
                        <AssignBooksDialog
                          employeeId={emp.id}
                          publications={publications}
                          assigned={assignedByEmployee[emp.id] || []}
                          allAssignedBooks={assigned}
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
      {/* PAGINATION */}
<div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
  <p className="text-gray-600 dark:text-gray-400">
    Page {page} of {totalPages}
  </p>

  <div className="flex flex-wrap items-center gap-2">
    {/* Prev */}
    {page > 1 && (
      <Link
        href={`?search=${encodeURIComponent(search)}&page=${page - 1}`}
        scroll={false}
        prefetch
        className="px-3 py-1 border rounded dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Prev
      </Link>
    )}

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => {
      const pageNumber = i + 1
      const active = page === pageNumber

      return (
        <Link
          key={pageNumber}
          href={`?search=${encodeURIComponent(search)}&page=${pageNumber}`}
          scroll={false}
          prefetch
          className={`px-3 py-1 border rounded transition ${
            active
              ? "bg-blue-500 text-white border-blue-500"
              : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {pageNumber}
        </Link>
      )
    })}

    {/* Next */}
    {page < totalPages && (
      <Link
        href={`?search=${encodeURIComponent(search)}&page=${page + 1}`}
        scroll={false}
        prefetch
        className="px-3 py-1 border rounded dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Next
      </Link>
    )}
  </div>
</div>

    </div>
  )
}