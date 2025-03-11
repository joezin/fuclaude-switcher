import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Fuclaude Switcher',
  description: 'Fuclaude Switcher',
}

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950`}>
          <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-blue-500 rounded-sm"></div>
                  <h1 className="text-xl font-semibold tracking-wide text-gray-900 dark:text-white">
                    Fuclaude <span className="font-light text-blue-500 dark:text-blue-400">Switcher</span>
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        登录
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200">
                        注册
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 rounded-full ring-2 ring-blue-500/70 hover:ring-blue-400"
                        }
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto  py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}