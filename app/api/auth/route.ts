import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface User {
  id: string
  name: string
  password: string
  createdAt: string
  lastLogin: string
}

interface UserDatabase {
  users: User[]
}

const DB_PATH = path.join(process.cwd(), "Db", "users.json")

// Ensure the Db directory exists
async function ensureDbDirectory() {
  const dbDir = path.join(process.cwd(), "Db")
  try {
    await fs.access(dbDir)
    console.log("Db directory exists")
  } catch {
    console.log("Creating Db directory...")
    await fs.mkdir(dbDir, { recursive: true })
    console.log("Db directory created")
  }
}

// Read users from file
async function readUsers(): Promise<UserDatabase> {
  try {
    await ensureDbDirectory()
    console.log("Reading users from:", DB_PATH)
    const data = await fs.readFile(DB_PATH, "utf8")
    const parsed = JSON.parse(data)
    console.log("Users loaded:", parsed.users.length)
    return parsed
  } catch (error) {
    console.log("File doesn't exist or error reading, creating default data...")
    // If file doesn't exist, create it with default data
    const defaultData: UserDatabase = {
      users: [
        {
          id: "1",
          name: "Demo User",
          password: "demo123",
          createdAt: "2025-01-20T10:00:00.000Z",
          lastLogin: "2025-01-20T10:00:00.000Z",
        },
      ],
    }
    await writeUsers(defaultData)
    return defaultData
  }
}

// Write users to file
async function writeUsers(data: UserDatabase): Promise<void> {
  try {
    await ensureDbDirectory()
    console.log("Writing users to:", DB_PATH)
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8")
    console.log("Users saved successfully. Total users:", data.users.length)

    // Verify the file was written
    const verification = await fs.readFile(DB_PATH, "utf8")
    console.log("File verification - content length:", verification.length)
  } catch (error) {
    console.error("Error writing users file:", error)
    throw error
  }
}

// Find user by name
async function findUser(name: string): Promise<User | null> {
  const data = await readUsers()
  const user = data.users.find((user) => user.name.toLowerCase() === name.toLowerCase()) || null
  console.log("Finding user:", name, "Found:", !!user)
  return user
}

// Create new user
async function createUser(name: string, password: string): Promise<User> {
  console.log("Creating new user:", name)
  const data = await readUsers()

  const newUser: User = {
    id: Date.now().toString(),
    name: name.trim(),
    password,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  data.users.push(newUser)
  await writeUsers(data)

  console.log("New user created and saved:", { id: newUser.id, name: newUser.name })
  return newUser
}

// Update user's last login
async function updateLastLogin(userId: string): Promise<void> {
  console.log("Updating last login for user:", userId)
  const data = await readUsers()
  const user = data.users.find((u) => u.id === userId)

  if (user) {
    user.lastLogin = new Date().toISOString()
    await writeUsers(data)
    console.log("Last login updated for:", user.name)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API Request received:", { action: body.action, name: body.name, hasPassword: !!body.password })

    const { action, name, password } = body

    if (!name || !password) {
      console.log("Missing name or password")
      return NextResponse.json({ success: false, error: "Name and password are required" }, { status: 400 })
    }

    const trimmedName = name.trim()

    if (action === "authenticate") {
      console.log("Authenticating user:", trimmedName)

      // Check if user exists
      const existingUser = await findUser(trimmedName)

      if (existingUser) {
        console.log("Existing user found, checking password")
        // Existing user - check password
        if (existingUser.password === password) {
          // Update last login
          await updateLastLogin(existingUser.id)
          console.log("User authenticated successfully:", existingUser.name)
          return NextResponse.json({
            success: true,
            user: existingUser,
            isNewUser: false,
          })
        } else {
          console.log("Invalid password for existing user")
          return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
        }
      } else {
        console.log("User not found, creating new user")
        // New user - create account automatically
        const newUser = await createUser(trimmedName, password)
        console.log("New user created successfully:", newUser.name)
        return NextResponse.json({
          success: true,
          user: newUser,
          isNewUser: true,
        })
      }
    }

    console.log("Invalid action:", action)
    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Authentication API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("GET request - fetching all users")
    const data = await readUsers()
    return NextResponse.json({
      success: true,
      users: data.users.map((user) => ({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      })), // Don't return passwords
      totalUsers: data.users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
