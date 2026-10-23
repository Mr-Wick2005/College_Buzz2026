import React from "react"

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top indigo/cyan aura */}
      <div 
        className="ambient-glow top-[-10%] left-[20%] w-[550px] h-[450px] bg-gradient-to-br from-indigo-600/25 via-cyan-500/15 to-transparent" 
      />
      {/* Center violet aura */}
      <div 
        className="ambient-glow top-[35%] right-[-5%] w-[600px] h-[550px] bg-gradient-to-tl from-purple-600/20 via-pink-500/10 to-transparent" 
      />
      {/* Bottom amber/orange warmth */}
      <div 
        className="ambient-glow bottom-[-10%] left-[10%] w-[500px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent" 
      />

      {/* Subtle fine dot grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  )
}

export default FloatingElements
