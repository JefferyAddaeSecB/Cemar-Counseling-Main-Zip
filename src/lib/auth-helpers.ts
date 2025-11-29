// This is a simple client-side auth helper for demo purposes
// In a real application, you would use a proper authentication system

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export function checkIsLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

export function setLoggedIn(value: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem("isLoggedIn", value ? "true" : "false")
  // Trigger storage event for other components to react
  window.dispatchEvent(new Event("storage"))
}

export function getCurrentUser(): User | null {
  if (!checkIsLoggedIn()) return null

  const userData = localStorage.getItem("userData")
  if (!userData) return null

  try {
    return JSON.parse(userData) as User
  } catch (e) {
    return null
  }
}

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // Create a mock user
      const user: User = {
        id: "1",
        name: email.split("@")[0],
        email: email,
        avatar: undefined,
      }

      // Save user data
      localStorage.setItem("userData", JSON.stringify(user))
      setLoggedIn(true)

      resolve(user)
    }, 1000)
  })
}

export function signup(name: string, email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // Create a mock user
      const user: User = {
        id: "1",
        name: name,
        email: email,
        avatar: undefined,
      }

      // Save user data
      localStorage.setItem("userData", JSON.stringify(user))
      setLoggedIn(true)

      resolve(user)
    }, 1000)
  })
}

export function logout(): Promise<boolean> {
  return new Promise((resolve) => {
    localStorage.removeItem("userData")
    setLoggedIn(false)
    resolve(true)
  })
}

