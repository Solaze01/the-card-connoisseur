type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next, error } = await searchParams;
  const destination = next?.startsWith("/admin") ? next : "/admin";
  const hasInvalidCredentials = error === "invalid";

  return <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center"><section className="w-full rounded-[1.35rem] border border-zinc-300 bg-surface p-6 shadow-[0_20px_45px_rgba(24,24,27,0.08)] sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Control Center</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin sign in</h1><p className="mt-2 text-sm text-foreground/65">Use your administrator credentials to continue.</p><form action="/api/admin/login" method="post" className="mt-6 space-y-4"><input type="hidden" name="next" value={destination} /><label className="block text-sm font-medium">Username<input name="username" autoComplete="username" required className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-accent" /></label><label className="block text-sm font-medium">Password<input name="password" type="password" autoComplete="current-password" required className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-accent" /></label>{hasInvalidCredentials ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">Incorrect username or password.</p> : null}<button className="w-full rounded-xl bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-strong">Sign in</button></form></section></main>;
}
