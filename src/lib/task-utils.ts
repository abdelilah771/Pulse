export const priorityConfig: Record<string, { label: string; color: string; border: string }> = {
  high: {
    label: "Focus Profond",
    color: "text-blue-600 dark:text-blue-300 bg-blue-500/15 dark:bg-blue-500/20 border-blue-500/30 dark:border-blue-500/20",
    border: "border-blue-500/20 dark:border-blue-500/30",
  },
  medium: {
    label: "Standard",
    color: "text-emerald-600 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/30 dark:border-emerald-500/20",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
  },
  low: {
    label: "Optionnel",
    color: "text-slate-600 dark:text-slate-300 bg-slate-500/10 dark:bg-white/10 border-slate-500/20 dark:border-white/10",
    border: "border-slate-300 dark:border-white/10",
  },
};

export const accentColors: Record<string, string> = {
  high: "bg-blue-500",
  medium: "bg-emerald-500",
  low: "bg-slate-500",
};

export function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPriority(priority: string) {
  return priorityConfig[priority] || priorityConfig.medium;
}

export function getAccentColor(priority: string) {
  return accentColors[priority] || accentColors.medium;
}
