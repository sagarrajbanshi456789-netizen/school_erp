import { create } from "zustand"

export const AUTH_VIEW = {
LOGIN: "login",
SIGNUP: "signup",
VERIFY: "verify-email",
FORGOT: "forgot-password",
RESET: "reset-password",
} as const

export type AuthView =
(typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]

interface AuthModalStore {
open: boolean
view: AuthView

email?: string
password?: string

openModal: (view?: AuthView) => void
setView: (view: AuthView) => void
setVerifyData: (email: string, password: string) => void
close: () => void
}

export const useAuthModal = create<AuthModalStore>((set) => ({
open: false,
view: AUTH_VIEW.LOGIN,

email: undefined,
password: undefined,

openModal: (view = AUTH_VIEW.LOGIN) =>
set({
open: true,
view,
}),

setView: (view) =>
set({
view,
}),

setVerifyData: (email, password) =>
set({
email,
password,
}),

close: () =>
set({
open: false,
view: AUTH_VIEW.LOGIN,
email: undefined,
password: undefined,
}),
}))
