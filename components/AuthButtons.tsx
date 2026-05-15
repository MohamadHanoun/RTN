import { signIn, signOut } from "@/auth";

export function DiscordLoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", {
          redirectTo: "/admin",
        });
      }}
    >
      <button
        type="submit"
        className="rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white transition hover:bg-indigo-400"
      >
        Login with Discord
      </button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/admin",
        });
      }}
    >
      <button
        type="submit"
        className="rounded-xl border border-white/10 px-6 py-3 font-bold text-gray-300 transition hover:bg-white/10"
      >
        Logout
      </button>
    </form>
  );
}