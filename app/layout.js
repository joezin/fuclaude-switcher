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
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Fuclaude Switcher',
  description: 'Fuclaude账号管理系统 - 简单、高效地管理您的账户',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider>
      <html lang="zh-CN" className="h-full">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-full bg-gradient-to-br from-gray-50/80 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900/95 dark:to-blue-950/20 `}>
          <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-1.5 h-8 bg-blue-600/90 dark:bg-blue-500/90 rounded-full shadow-sm"></div>
                    <div className="absolute -right-0.5 -top-0.5 w-1.5 h-8 bg-blue-400/50 dark:bg-blue-300/30 rounded-full blur-sm"></div>
                  </div>
                  <h1 className="text-xl font-semibold tracking-wide text-gray-900 dark:text-white">
                    Fuclaude <span className="font-light bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">Switcher</span>
                  </h1>
                </div>
                <div className="flex items-center space-x-3">
                  <SignedOut>
                    <div className="flex items-center gap-3">
                      <SignInButton mode="modal">
                        <button className="inline-flex items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm">
                          登录
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 px-4 py-2 text-sm font-medium text-white transition-all duration-200">
                          注册
                        </button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center space-x-4">
                      <a
                        href="https://github.com/liujuntao123/fuclaude-switcher"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full"
                        aria-label="GitHub 仓库"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                          className="w-5 h-5"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9 rounded-full ring-2 ring-blue-500/70 hover:ring-blue-400 transition-all duration-300 shadow-sm"
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto ">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}