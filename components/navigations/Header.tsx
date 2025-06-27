"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Workflow } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

function Header() {
    const pathname = usePathname();
    const isHomePage = pathname ==="/"
  return (
<div
  className={`p-4 flex justify-between items-center transition-all duration-300 ${
    isHomePage
      ? "bg-gradient-to-r from-blue-50 to-blue-100"
      : "bg-white border-b border-blue-100 shadow-sm"
  }`}
>
  {/* Logo + Brand */}
  <Link href="/" className="flex items-center hover:opacity-90 transition">
    <Workflow className="w-8 h-8 text-blue-500 mr-2" />
    <h1 className="text-xl font-bold tracking-tight text-gray-800">
      <span className="text-blue-600">Linkayi</span>
    </h1>
  </Link>

  {/* Navigation */}
  <div className="flex items-center space-x-4">
    <SignedIn>
      <Link href="/docs">
        <Button
          variant="outline"
          className="hover:scale-105 transition-transform hover:cursor-pointer hover:border-blue-400 text-sm"
        >
          My Docs
        </Button>
      </Link>
      <Link href="/manage-plan">
        <Button className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white hover:scale-105 transition-transform text-sm">
          Manage Plan
        </Button>
      </Link>
      <UserButton />
    </SignedIn>

    <SignedOut>
      <SignInButton mode="modal">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white hover:cursor-pointer hover:scale-105 transition-transform text-sm">
          Login
        </Button>
      </SignInButton>
    </SignedOut>
  </div>
</div>

  )
}

export default Header