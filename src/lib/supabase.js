import { supabase } from "./supabase/client"

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""

export const EDGE_FUNCTION_URL = `${supabaseUrl}/functions/v1/make-server-028b7c87`

export { supabase }

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUpStudent({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,

    password,

    options: {
      data: { full_name: name || email.split("@")[0], role: "student" },
    },
  })

  if (error) throw error

  // If Supabase auto-confirmed (email confirmation disabled), upsert profile now

  if (data.user) {
    try {
      await supabase.from("profiles").upsert({
        id: data.user.id,

        role: "student",

        full_name: name || email.split("@")[0],
      })
    } catch (_) {
      /* table may not exist yet — non-fatal */
    }
  }

  // Returns { user, session } — session is non-null when email confirmation is OFF

  return data
}

export async function signUpAdmin({
  email,
  password,
  adminName,
  collegeName,
  contactNumber,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,

    password,

    options: {
      data: { full_name: adminName || email.split("@")[0], role: "admin" },
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

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Upsert profile on every login so it stays in sync with auth.users

  if (data.user) {
    try {
      const meta = data.user.user_metadata || {}

      await supabase.from("profiles").upsert(
        {
          id: data.user.id,

          role: meta.role || "student",

          full_name: meta.full_name || email.split("@")[0],

          college: meta.college || null,
        },
        { onConflict: "id", ignoreDuplicates: false },
      )
    } catch (_) {
      /* non-fatal */
    }
  }

  return data
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({ type: "signup", email })

  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
  ;["token", "user_email", "user_name", "user_role", "college_name"].forEach(
    (k) => localStorage.removeItem(k),
  )
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`,
  })

  if (error) throw error
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error

  return data
}

export async function getCurrentProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (data) return data

    // Fallback if not yet created in table

    const meta = user.user_metadata || {}

    return {
      id: user.id,

      role: meta.role || "student",

      full_name: meta.full_name || user.email?.split("@")[0] || "",

      college: meta.college || null,

      contact_number: meta.contact_number || null,
    }
  } catch (_) {
    return null
  }
}

// ── Events helpers ───────────────────────────────────────────────────────────

export async function getEvents(filters = {}) {
  try {
    let query = supabase

      .from("events")

      .select("*, profiles(full_name, college)")

    if (filters.category && filters.category !== "All") {
      query = query.eq("category", filters.category)
    }

    if (filters.college) {
      query = query.ilike("college", `%${filters.college}%`)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,college.ilike.%${filters.search}%`,
      )
    }

    if (filters.fromDate) {
      query = query.gte("date", filters.fromDate)
    }

    if (filters.toDate) {
      query = query.lte("date", filters.toDate)
    }

    if (filters.isLive !== undefined) {
      query = query.eq("is_live", filters.isLive)
    }

    query = query.order("date", { ascending: true })

    const { data, error } = await query

    if (error) throw error

    if (data && data.length > 0) return data

    // If no data returned from DB, return seed data matching filters

    let fallback = SEED_EVENTS.map((e, i) => ({ ...e, id: `seed_${i}` }))

    if (filters.category && filters.category !== "All") {
      fallback = fallback.filter((e) => e.category === filters.category)
    }

    if (filters.search) {
      const s = filters.search.toLowerCase()

      fallback = fallback.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s),
      )
    }

    return fallback
  } catch (err) {
    console.warn(
      "[Events] Error fetching events, using fallback:",
      err?.message || err,
    )

    return SEED_EVENTS.map((e, i) => ({ ...e, id: `seed_${i}` }))
  }
}

export async function getEventById(eventId) {
  try {
    const { data, error } = await supabase

      .from("events")

      .select("*, profiles(full_name, college, contact_number)")

      .eq("id", eventId)

      .single()

    if (error) throw error

    return data
  } catch (err) {
    const seed = SEED_EVENTS.find((e, i) => `seed_${i}` === eventId)

    return seed || null
  }
}

export async function getMyEvents() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  try {
    const { data, error } = await supabase

      .from("events")

      .select("*, registrations(count)")

      .eq("organizer_id", user.id)

      .order("date", { ascending: true })

    if (error) throw error

    return data || []
  } catch (_) {
    return []
  }
}

export async function createEvent(eventData) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    throw new Error(
      "You must be logged in as an administrator to publish an event.",
    )

  const profile = await getCurrentProfile()

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: eventData.title,

      category: eventData.category || "Workshop",

      description: eventData.description || "",

      date: eventData.date,

      time: eventData.time || "10:00 AM",

      location: eventData.location || "Campus Auditorium",

      college: profile?.college || eventData.college || "Partner Institution",

      image_url:
        eventData.image_url ||
        eventData.image ||
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",

      capacity: eventData.capacity || 100,

      tags: eventData.tags || [],

      is_live: eventData.is_live || false,

      registration_link: eventData.registration_link || null,

      organizer_id: user.id,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateEvent(eventId, updates) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase

    .from("events")

    .update(updates)

    .eq("id", eventId)

    .select()

    .single()

  if (error) throw error

  return data
}

export async function deleteEvent(eventId) {
  const { error } = await supabase.from("events").delete().eq("id", eventId)

  if (error) throw error
}

export async function incrementEventViews(eventId) {
  try {
    await supabase.rpc("increment_event_views", { event_id: eventId })
  } catch (_) {
    /* Non-fatal if RPC not installed */
  }
}

// ── Storage helpers ──────────────────────────────────────────────────────────

export async function uploadEventPoster(file) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    throw new Error(
      "You must be logged in as an administrator to upload event posters.",
    )

  // Validate MIME type

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.",
    )
  }

  // Validate max size (5 MB)

  const MAX_SIZE = 5 * 1024 * 1024

  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds the 5MB limit.")
  }

  const cleanName = (file.name || "poster.jpg").replace(/[^a-zA-Z0-9.-]/g, "_")

  const filePath = `${user.id}/${Date.now()}_${cleanName}`

  const { data, error } = await supabase.storage

    .from("event-posters")

    .upload(filePath, file, {
      cacheControl: "3600",

      upsert: false,
    })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage

    .from("event-posters")

    .getPublicUrl(data.path)

  return { path: data.path, publicUrl }
}

// ── Registrations helpers ────────────────────────────────────────────────────

export async function getMyRegistrations() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  try {
    const { data, error } = await supabase

      .from("registrations")

      .select("*, events(*)")

      .eq("student_id", user.id)

      .order("registered_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (_) {
    return []
  }
}

export async function registerForEvent(eventId) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Please sign in to register for events.")

  // 1. Check if user is already registered (fast client check before database unique constraint)

  try {
    const { data: existing } = await supabase

      .from("registrations")

      .select("id, qr_code, registered_at")

      .eq("event_id", eventId)

      .eq("student_id", user.id)

      .maybeSingle()

    if (existing) {
      throw new Error(
        'You have already registered for this event! Check "My Passes" on your dashboard.',
      )
    }
  } catch (err) {
    if (err.message.includes("already registered")) throw err

    // Continue to database insert which enforces UNIQUE(event_id, student_id)
  }

  // 2. Check event capacity

  try {
    const { data: eventData } = await supabase

      .from("events")

      .select("capacity")

      .eq("id", eventId)

      .single()

    if (eventData?.capacity) {
      const { count } = await supabase

        .from("registrations")

        .select("id", { count: "exact", head: true })

        .eq("event_id", eventId)

        .eq("status", "confirmed")

      if (count && count >= eventData.capacity) {
        throw new Error(
          "Sorry, this event has reached its maximum seat capacity.",
        )
      }
    }
  } catch (err) {
    if (err.message.includes("capacity")) throw err
  }

  // 3. Insert registration with unique digital pass QR code

  const qrCode = `BUZZ-${String(eventId).slice(0, 8).toUpperCase()}-${user.id.slice(0, 6).toUpperCase()}`

  const { data, error } = await supabase

    .from("registrations")

    .insert({
      event_id: eventId,

      student_id: user.id,

      qr_code: qrCode,

      status: "confirmed",
    })

    .select()

    .single()

  if (error) {
    if (
      error.code === "23505" ||
      error.message?.includes("unique") ||
      error.message?.includes("duplicate")
    ) {
      throw new Error("You are already registered for this event!")
    }

    throw error
  }

  return data
}

export async function cancelRegistration(registrationId) {
  const { error } = await supabase

    .from("registrations")

    .delete()

    .eq("id", registrationId)

  if (error) throw error
}

export async function getEventRegistrations(eventId) {
  try {
    const { data, error } = await supabase

      .from("registrations")

      .select(
        "id, qr_code, status, registered_at, profiles(full_name, college, contact_number)",
      )

      .eq("event_id", eventId)

      .order("registered_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (_) {
    return []
  }
}

// ── Seed data ────────────────────────────────────────────────────────────────

export const SEED_EVENTS = [
  {
    title: "Tech Innovation Summit 2025",

    category: "Workshop",

    date: "2025-03-15T10:00:00Z",

    time: "10:00 AM",

    location: "MIT Auditorium",

    image_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",

    capacity: 500,

    college: "MIT Institute",

    description:
      "Explore AI, Quantum Computing, and Next-Gen Web Technologies with industry leaders.",

    tags: ["AI", "Tech", "Workshop"],

    is_live: false,
  },

  {
    title: "Annual Cultural Fest - Euphoria",

    category: "Cultural",

    date: "2025-03-20T18:00:00Z",

    time: "06:00 PM",

    location: "Main Campus Grounds",

    image_url:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",

    capacity: 1200,

    college: "Stanford University",

    description:
      "A night of music, art, lights, and mesmerizing stage performances across 5 arenas.",

    tags: ["Music", "Art", "Cultural"],

    is_live: true,
  },

  {
    title: "National Sports Championship",

    category: "Sports",

    date: "2025-03-25T09:00:00Z",

    time: "09:00 AM",

    location: "Central Sports Complex",

    image_url:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",

    capacity: 800,

    college: "Harvard Campus",

    description:
      "Track & Field, Basketball, Soccer, and Esports tournaments with cash prizes.",

    tags: ["Sports", "Championship"],

    is_live: false,
  },

  {
    title: "CodeStorm Hackathon 2025",

    category: "Hackathon",

    date: "2025-03-30T08:00:00Z",

    time: "08:00 AM",

    location: "Computer Science Center",

    image_url:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",

    capacity: 300,

    college: "UC Berkeley",

    description:
      "36-hour non-stop hackathon building real-world AI and Open Source solutions.",

    tags: ["Coding", "AI", "Hackathon"],

    is_live: false,
  },
]

export async function seedEventsIfEmpty() {
  try {
    const { count } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })

    if (count === 0) {
      await supabase.from("events").insert(SEED_EVENTS)
    }
  } catch (_) {
    /* non-fatal */
  }
}
