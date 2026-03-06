import Image from "next/image";
import IASvg from "@/app/assets/IAIcon.svg";

export default function IAIcon({ className }: { className?: string }) {
  return <Image src={IASvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}