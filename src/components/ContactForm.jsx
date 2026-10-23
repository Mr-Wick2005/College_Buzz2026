import React, { useState } from "react"
import emailjs from "@emailjs/browser"
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const sendEmail = (e) => {
    e.preventDefault()
    setSending(true)

    emailjs
      .send(
        "service_nhwld09",
        "template_qwbllxm",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          full_message: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
        },
        "E-c_8dyOKpo_SgjZW",
      )
      .then(() => {
        setStatus("success")
        setSending(false)
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setStatus(""), 5000)
      })
      .catch(() => {
        setStatus("error")
        setSending(false)
        setTimeout(() => setStatus(""), 5000)
      })
  }

  return (
    <form onSubmit={sendEmail} className="max-w-xl mx-auto space-y-4 text-left">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Maya Chen"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
          University Email / Contact
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
          Inquiry or Fest Proposal
        </label>
        <textarea
          name="message"
          rows="4"
          placeholder="Tell us about your campus event, sponsorship, or how you'd like to collaborate..."
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium resize-none"
        />
      </div>

      {status === "success" && (
        <div className="flex items-center space-x-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Message transmitted directly to the campus coordination team!</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center space-x-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>Transmission failed. You can also reach us at vedantmgali@gmail.com</span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
      >
        {sending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Submit Dispatch</span>
            <Send size={15} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  )
}

export default ContactForm
