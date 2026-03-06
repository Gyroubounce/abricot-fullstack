import Image from "next/image";
import FolderSvg from "@/app/assets/Folder.svg";

export default function FolderIcon({ className }: { className?: string }) {
  return <Image src={FolderSvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}