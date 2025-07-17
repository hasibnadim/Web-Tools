export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/cold-bg.jpg)' }}>
            {/* Overlay for cold, dreamy effect */}
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" aria-hidden="true" />
            {/* Glassy Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/20 border border-white/30 backdrop-blur-xl flex flex-col items-center"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)' }}>
                {children}

            </div>
            {/* Frosty edge effect (optional, can be enhanced with custom CSS) */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at 10% 10%, rgba(0,0,0,0.12) 0, transparent 60%), radial-gradient(circle at 90% 90%, rgba(0,0,0,0.12) 0, transparent 70%)'
            }} />
        </div>
    )
}