import Image from "next/image";
import DashboardSvg from "@/app/assets/Dashboard.svg";

export default function DashboardIcon({ className }: { className?: string }) {
  return <Image src={DashboardSvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}