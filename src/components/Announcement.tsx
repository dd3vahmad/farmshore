export default function Announcement({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="bg-primary px-4 py-2 text-center text-sm text-light">
      {text}
    </div>
  );
}
