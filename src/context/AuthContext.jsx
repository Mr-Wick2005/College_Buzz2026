import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { supabase } from "../lib/supabase/client"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the verified profile directly from the Supabase database
  const fetchProfile = useCallback(async (userId, fallbackMeta = {}) => {
    if (!userId) {
      setProfile(null)
      return null
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (error && error.code !== "PGRST116") {
        console.warn("[Auth] Error fetching profile:", error.message)
      }

      if (data) {
        setProfile(data)
        // Sync to localStorage for backwards compatibility
        localStorage.setItem("user_role", data.role || "student")
        localStorage.setItem("user_name", data.full_name || "")
        if (data.college) localStorage.setItem("college_name", data.college)
        return data
      }

      // If profile row doesn't exist in database yet, create it from user metadata
      const initialProfile = {
        id: userId,
        role: fallbackMeta.role || "student",
        full_name: fallbackMeta.full_name || fallbackMeta.name || "",
        college: fallbackMeta.college || null,
        contact_number: fallbackMeta.contact_number || null,
      }

      try {
        const { data: created } = await supabase
          .from("profiles")
          .upsert(initialProfile, { onConflict: "id" })
          .select()
          .single()
        if (created) {
          setProfile(created)
          localStorage.setItem("user_role", created.role || "student")
          localStorage.setItem("user_name", created.full_name || "")
          if (created.college)
            localStorage.setItem("college_name", created.college)
          return created
        }
      } catch (_) {
        // Non-fatal if table not ready
      }

      setProfile(initialProfile)
      return initialProfile
    } catch (err) {
      console.error("[Auth] fetchProfile caught:", err)
      return null
    }
  }, [])

  // Initialize session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (isMounted) {
          setSession(initialSession)
          setUser(initialSession?.user || null)

          if (initialSession?.user) {
            localStorage.setItem("token", initialSession.access_token)
            localStorage.setItem("user_email", initialSession.user.email || "")
            await fetchProfile(
              initialSession.user.id,
              initialSession.user.user_metadata,
            )
          } else {
            localStorage.removeItem("token")
          }
        }
      } catch (err) {
        console.error("[Auth] Init session error:", err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return

      setSession(newSession)
      setUser(newSession?.user || null)

      if (newSession?.user) {
        localStorage.setItem("token", newSession.access_token)
        localStorage.setItem("user_email", newSession.user.email || "")
        await fetchProfile(newSession.user.id, newSession.user.user_metadata)
      } else {
        setProfile(null)
        ;[
          "token",
          "user_email",
          "user_name",
          "user_role",
          "college_name",
        ].forEach((k) => localStorage.removeItem(k))
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  // Auth Operations
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    if (data.user) {
      await fetchProfile(data.user.id, data.user.user_metadata)
    }
    return data
  }

  const signUpStudent = async ({ email, password, name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split("@")[0],
          role: "student",
        },
      },
    })
    if (error) throw error

    if (data.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          role: "student",
          full_name: name || email.split("@")[0],
        })
      } catch (_) {
        /* non-fatal */
      }
    }
    return data
  }

  const signUpAdmin = async ({
    email,
    password,
    adminName,
    collegeName,
    contactNumber,
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: adminName || email.split("@")[0],
          role: "admin",
          college: collegeName || null,
          contact_number: contactNumber || null,
        },
      },
    })
    if (error) throw error

    if (data.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          role: "admin",
          full_name: adminName || email.split("@")[0],
          college: collegeName || null,
          contact_number: contactNumber || null,
        })
      } catch (_) {
        /* non-fatal */
      }
    }
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    ;["token", "user_email", "user_name", "user_role", "college_name"].forEach(
      (k) => localStorage.removeItem(k),
    )
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  }

  const refreshProfile = async () => {
    if (user?.id) {
      return await fetchProfile(user.id, user.user_metadata)
    }
    return null
  }

  const role =
    profile?.role ||
    user?.user_metadata?.role ||
    (localStorage.getItem("user_role") === "college"
      ? "admin"
      : localStorage.getItem("user_role")) ||
    null

  const value = {
    session,
    user,
    profile,
    role,
    loading,
    isAuthenticated: !!session && !!user,
    isAdmin: role === "admin",
    isStudent: role === "student",
    signIn,
    signUpStudent,
    signUpAdmin,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
