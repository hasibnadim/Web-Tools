
import React from 'react'
import LoginButton from './LoginButton';

// NOTE: Place a cold, frosty, blueish background image in public/cold-bg.jpg
// Example: Unsplash search for "frosted window", "snowy landscape bokeh", or "cold winter abstract".
// Recommended size: 1920x1080 or higher for best quality.
//  

const Page = async () => {

  return (
    <>
      <h1 className="text-3xl font-bold text-white drop-shadow mb-6 tracking-wide">Welcome to BAW World</h1>
      {/* continue with Google button */} 
      <LoginButton />

    </>
  )
}
export default Page
/**
 * <form className="w-full flex flex-col gap-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-black/40 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition border border-white/30 shadow-inner"
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-black/40 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300  transition border border-white/30 shadow-inner"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-blue-800 transition-all backdrop-blur-md border border-white/30 mt-2"
        >
          Log In
        </button>
      </form>
      <div className="mt-6 text-blue-100 text-sm opacity-80">
        <span>Don&apos;t have an account?</span>
        <a href="/auth/register" className="ml-2 underline hover:text-white transition">Register</a>
      </div>
 */