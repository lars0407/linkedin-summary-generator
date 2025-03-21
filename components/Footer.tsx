import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div>
        Ermöglicht durch KI{' '}
        <a
          href="https://openai.com"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition underline-offset-2"
        >
          
        </a>
      </div>
      <div className="flex space-x-4 pb-4 sm:pb-0">
        <Link
          href="https://x.com/Jobjaegerde"
          className="group"
          aria-label="Jobjäger auf X.com"
          target="_blank"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </Link>
        <Link
          href="https://www.linkedin.com/company/jobjaeger"
          className="group"
          aria-label="Jobjäger auf LinkedIn"
          target="_blank"
        >
          <svg
            className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
            viewBox="0 0 24 24"
          >
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
        </Link>
      </div>
    </footer>
  );
}
