export default function Footer() {
  return (
    <footer className="w-full bg-bg-content flex justify-center border-t border-system-neutral mt-10">
      <div className="w-[1440px] h-[72px] flex items-center justify-between px-4 md:px-0">
        
        {/* Logo */}
        <span className="text-[22px] font-manrope font-bold text-text-primary">
          Abricot
        </span>

        {/* Copyright */}
        <span className="text-[14px] font-inter text-neutral-grey">
          Abricot 2025
        </span>
      </div>
    </footer>
  );
}