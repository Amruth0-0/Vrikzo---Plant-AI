// src/components/ReminderButton.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { ReminderDialog } from "./ReminderDialog";

export function ReminderButton({ plantName,remedyText }: { plantName: string , remedyText: string}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-emerald-500/20 border border-emerald-400/30">
        Set Reminder
      </Button>
      <ReminderDialog open={open} onOpenChange={setOpen} plantName={plantName} remedyText={remedyText} />
    </>
  );
}
