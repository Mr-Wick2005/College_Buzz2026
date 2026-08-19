import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_nhwld09",
      "template_qwbllxm",
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        full_message: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      },
      "E-c_8dyOKpo_SgjZW"
    )
    .then(() => {
      setStatus('success');
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(''), 4000);
    })
    .catch(() => {
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    });
  };

  return (
    <form onSubmit={sendEmail} className="max-w-xl mx-auto space-y-6">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        name="message"
        rows="4"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {status === 'success' && <p className="text-green-400 text-sm text-center">Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-400 text-sm text-center">Failed to send message. Please try again.</p>}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-500"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
