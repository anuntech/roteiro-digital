import { ModeToggle } from "../_components/mode-toggle";

export const dynamic = "force-dynamic";

export default function Technical() {
  return (
    <div className="hidden flex-col gap-8 p-10 md:flex">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Roteiro Digital</h2>
        <ModeToggle />
      </header>
    </div>
  );
}
