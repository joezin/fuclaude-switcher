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
                    <div className="flex items-center space-x-4">
                      <a
                        href="https://github.com/liujuntao123/fuclaude-switcher"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="w-6 h-6"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 rounded-full ring-2 ring-blue-500/70 hover:ring-blue-400"
                          }
                        }}
                      />
                    </div>
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