type Props = {
  title: string;
  icon: string;
  accentClass: string;
  children: React.ReactNode;
};

export default function NotesSection({ title, icon, accentClass, children }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${accentClass}`}>
          {icon}
        </span>
        <h2 className="font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}