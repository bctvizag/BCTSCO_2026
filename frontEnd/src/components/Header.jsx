import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
}

export default function Header() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'SQL Admin'

  return (
    <header className="h-11 shrink-0 bg-white border-b border-slate-200 flex items-center px-5 gap-3">
      <div>
        <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
        <p className="text-2xs text-slate-400">Babbage Computers</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-2xs text-slate-400">
          {new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </header>
  )
}
