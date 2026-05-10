export const createConversationId = (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join("_")
}

export const formatMessage = (msg: any) => {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    content: msg.content,
    fileUrl: msg.fileUrl || null,
    fileType: msg.fileType || null,
    createdAt: msg.createdAt,
  }
}

export const isAdmin = (role?: string) => role === "ADMIN"

export const isEmployee = (role?: string) => role === "EMPLOYEE"

export const isCustomer = (role?: string) => role === "CUSTOMER"