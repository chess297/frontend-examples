import { SystemInitForm } from "./system-init-form";

export default function SystemInitPage() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <SystemInitForm />
      </div>
    </div>
  );
}
