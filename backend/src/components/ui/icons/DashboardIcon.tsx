
// src/components/ui/icons/KanbanIcon.tsx
export default function KanbanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="8" height="8" rx="1" />
      <rect x="10" y="0" width="8" height="8" rx="1" />
      <rect x="0" y="10" width="8" height="8" rx="1" />
      <rect x="10" y="10" width="8" height="8" rx="1" />
    </svg>
  );
}