import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <img
          alt="Jobjäger Logo"
          src="https://ucarecdn.com/71f5961c-a494-4ad0-8484-4cd73c1a0039/Logo.png"
          className="h-8 sm:h-10"
          style={{ width: 'auto' }}
        />
      </Link>
      <a
        className="flex max-w-fit items-center justify-center rounded-2xl bg-[#0F973D] px-5 py-2 text-base font-medium text-white shadow-md transition-colors hover:bg-[#2ea14c]"
        href="https://jobjaeger.de"
        target="_blank"
        rel="noopener noreferrer"
      >
        Finde deinen Traumjob
      </a>
    </header>
  );
}
