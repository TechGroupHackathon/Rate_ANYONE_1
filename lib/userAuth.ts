interface User {
  id: string
  name: string
  password?: string // Optional since we don't store passwords in session
  createdAt: string
  lastLogin: string
}

export const userAuth = {
  // Authenticate user (login or auto-register)
  authenticate: async (
    name: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; isNewUser?: boolean; error?: string }> => {
    const trimmedName = name.trim()

    if (!trimmedName || !password) {
      return { success: false, error: "Name and password are required" }
    }

    console.log("Authenticating user:", trimmedName, "Password length:", password.length)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "authenticate",
          name: trimmedName,
          password,
        }),
      })

      console.log("API Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error response:", errorText)
        return {
          success: false,
          error: `Server error (${response.status}): ${errorText}`,
        }
      }

      const data = await response.json()
      console.log("API Response data:", data)

      if (data.success) {
        // Remove password from user object before storing in session
        const { password: _, ...userWithoutPassword } = data.user
        return {
          success: true,
          user: userWithoutPassword,
          isNewUser: data.isNewUser,
        }
      } else {
        return {
          success: false,
          error: data.error || "Authentication failed",
        }
      }
    } catch (error) {
      console.error("Network error during authentication:", error)
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      }
    }
  },

  // Get all users (for development/debugging)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch("/api/auth")
      const data = await response.json()

      if (data.success) {
        console.log("Fetched users:", data.totalUsers)
        return data.users
      } else {
        console.error("Error fetching users:", data.error)
        return []
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  },
}

// User session management (unchanged)
export const userSession = {
  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rateit_user", JSON.stringify(user))
      console.log("User session saved:", user.name)
    }
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("rateit_user")
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rateit_user")
      console.log("User session cleared")
    }
  },

  isLoggedIn: (): boolean => {
    return userSession.getUser() !== null
  },
}
