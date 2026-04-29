import './portal.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <body className="auth-page">{children}</body>
}
