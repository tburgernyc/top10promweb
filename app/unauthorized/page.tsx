import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-rose-500 mb-4">403</p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You don&apos;t have permission to view this page. If you believe this is an error, contact your store owner or platform administrator.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}
