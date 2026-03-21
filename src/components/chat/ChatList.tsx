'use client'

interface User {
  id: string
  name: string
  online?: boolean
  lastMessage?: string
  time?: string
  unread?: number
}

interface Props {
  onSelect: (user: User) => void
  selectedUserId?: string
}

export default function ChatList({
  onSelect,
  selectedUserId,
}: Props) {

  // 🔥 Later replace with API/socket data
  const users: User[] = [
    {
      id: '1',
      name: 'Ramesh',
      online: true,
      lastMessage: 'Wants to topup account',
      time: '2m',
      unread: 2,
    },
    {
      id: '2',
      name: 'Sita',
      online: false,
      lastMessage: 'Payment done',
      time: '10m',
      unread: 0,
    },
    {
      id: '3',
      name: 'Amit',
      online: true,
      lastMessage: 'Hello admin',
      time: '1h',
      unread: 5,
    },
  ]

  return (
    <div className="divide-y">

      {users.map((user) => {
        const isActive = selectedUserId === user.id

        return (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className={`flex items-center gap-3 p-4 cursor-pointer transition
            ${
              isActive
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >

            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name[0]}
              </div>

              {/* 🟢 Online Dot */}
              {user.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user.name}
              </p>

              <p className="text-xs text-muted-foreground truncate">
                {user.lastMessage}
              </p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">
                {user.time}
              </span>

              {/* 🔴 Unread badge */}
              {user.unread && user.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {user.unread > 99 ? '99+' : user.unread}
                </span>
              )}
            </div>

          </div>
        )
      })}

    </div>
  )
}