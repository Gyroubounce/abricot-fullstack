import Image from "next/image";
import CommentsSvg from "@/app/assets/Comments.svg";

export default function CommentsIcon({ className }: { className?: string }) {
  return <Image src={CommentsSvg} alt="" aria-hidden="true" className={className} width={14} height={14} />;
}