import Link from 'next/link';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300 hover:bg-white/10">
        <Link href="/" className="text-white font-bold text-xl tracking-tighter hover:scale-105 transition-transform duration-300">
          NEXUS<span className="text-indigo-500">.</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className="relative text-gray-300 text-sm font-medium tracking-wide transition-colors duration-300 hover:text-white group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </div>

        <button className="md:hidden text-white flex flex-col gap-1.5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <span className="block w-5 h-[2px] bg-white rounded-full"></span>
          <span className="block w-5 h-[2px] bg-white rounded-full"></span>
        </button>
      </div>
    </nav>
  );
}
