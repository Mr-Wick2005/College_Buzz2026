import React from 'react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-indigo-400/30 rounded-full animate-bounce delay-500" />
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-1500" />
      <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping delay-700" />
      <div className="absolute top-1/2 left-1/6 w-64 h-64 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-1200" />
    </div>
  );
};

export default FloatingElements;
