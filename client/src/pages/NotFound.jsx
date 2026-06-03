import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen blueprint-grid flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-[120px] font-black leading-none bg-gradient-to-br from-blue-400 to-indigo-600 bg-clip-text text-transparent select-none mb-4">
                    404
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
