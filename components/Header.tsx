import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <img
          alt="header text"
          src="/write.svg"
          className="sm:w-9 sm:h-9 w-8 h-8"
        />
        <h1 className="sm:text-3xl text-2xl font-bold ml-2 tracking-tight">
          twitterbio.io
        </h1>
      </Link>
      <a
        className="flex max-w-fit items-center justify-center rounded-2xl bg-[#35B957] px-5 py-2 text-base font-medium text-white shadow-md transition-colors hover:bg-[#2ea14c]"
        href="https://jobjaeger.de"
        target="_blank"
        rel="noopener noreferrer"
      >
        Finde deinen Traumjob
      </a>
    </header>
  );
}
