import Image from "next/image";
import ListSvg from "@/app/assets/List.svg";

export default function ListIcon({ className }: { className?: string }) {
  return <Image src={ListSvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}