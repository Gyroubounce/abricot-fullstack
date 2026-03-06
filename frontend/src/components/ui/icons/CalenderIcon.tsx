import Image from "next/image";
import CalenderSvg from "@/app/assets/Calender.svg";

export default function CalenderIcon({ className }: { className?: string }) {
  return <Image src={CalenderSvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}