export const COLOR_STYLES: Record<string, string> = {
  emerald: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]",
  blue: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]",
  purple: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]",
  orange: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]",
  rose: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]",
};

export const GRADIENT_MAP: Record<string, string> = {
  emerald: "from-emerald-600 via-emerald-500 to-teal-400",
  blue: "from-blue-600 via-blue-500 to-cyan-400",
  purple: "from-purple-600 via-violet-500 to-fuchsia-400",
  orange: "from-orange-600 via-orange-500 to-amber-400",
  rose: "from-rose-600 via-pink-500 to-rose-400",
};

export const IMAGE_MAP: Record<string, string> = {
  emerald: 'url("https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2564&auto=format&fit=crop")',
  blue: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
  purple: 'url("https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2564&auto=format&fit=crop")',
  orange: 'url("https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2564&auto=format&fit=crop")',
  rose: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop")',
};

export function getProjectColorStyle(color: string): string {
  return COLOR_STYLES[color] || COLOR_STYLES.emerald;
}

export function getProjectGradient(color: string): string {
  return GRADIENT_MAP[color] || GRADIENT_MAP.blue;
}

export function getProjectImage(color: string): string {
  return IMAGE_MAP[color] || IMAGE_MAP.blue;
}

export function calculateStats(tasks: { done: boolean }[]) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const inProgress = totalTasks - completedTasks;
  return { totalTasks, completedTasks, inProgress };
}
