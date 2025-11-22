// src/components/ReminderDialog.tsx
import { motion } from "motion/react";
import axios from "axios";
import { useState } from "react";
import { BellRing, Droplets, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plantName: string;
  remedyText: string
}

export function ReminderDialog({ open, onOpenChange, plantName, remedyText }: ReminderDialogProps) {
  const [action, setAction] = useState<"water" | "treatment">("water");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00"); // hh:mm (12-hour or 24 will be parsed)
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [loading, setLoading] = useState(false);

  const combineAndConvertToISO = (dateStr: string, timeStr: string, ampmVal: string) => {
    // dateStr e.g. "2025-11-21" ; timeStr e.g. "03:30"
    if (!dateStr || !timeStr) return null;

    let [hourStr, minuteStr] = timeStr.split(":");
    let hour = Number(hourStr);
    const minute = Number(minuteStr || "0");

    // convert 12-hour to 24-hour
    if (ampmVal === "PM" && hour < 12) hour += 12;
    if (ampmVal === "AM" && hour === 12) hour = 0;

    const dt = new Date(dateStr);
    dt.setHours(hour, minute, 0, 0);
    return dt.toISOString();
  };

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select a date & time!");
      return;
    }

    const iso = combineAndConvertToISO(date, time, ampm);
    if (!iso) {
      alert("Invalid date/time");
      return;
    }

    setLoading(true);
    try {
      const storedEmail = localStorage.getItem("vrikzo_user_email");
      if (!storedEmail) return alert("Please log in first.");

      await axios.post("http://localhost:5000/api/reminders/create", {
        email: storedEmail,
        plantName,
        action,
        remedyText ,
        scheduleDate: iso,
        
      });

      alert("🌱 Reminder set successfully. You’ll receive an email at the scheduled time!");
      onOpenChange(false);
      setAction("water");
      setDate("");
      setTime("12:00");
      setAmpm("AM");
    } catch (err) {
      console.error("Reminder error:", err);
      alert("Failed to set reminder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black border-emerald-500/30 text-white overflow-hidden">
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl tracking-wide font-mono text-emerald-400 flex items-center justify-center gap-2">
              <BellRing className="w-6 h-6" /> Plant Reminder
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSetReminder} className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300 font-mono">Plant Name</Label>
              <Input
                value={plantName}
                readOnly
                className="bg-white/5 border-emerald-500/30 text-gray-200 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-mono">Action</Label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setAction("water")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-mono ${
                    action === "water" ? "border-emerald-400 bg-emerald-500/20" : "border-gray-700 bg-white/5"
                  }`}>
                  <Droplets className="w-4 h-4 text-emerald-300" /> Water
                </button>

                <button type="button" onClick={() => setAction("treatment")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-mono ${
                    action === "treatment" ? "border-cyan-400 bg-cyan-500/20" : "border-gray-700 bg-white/5"
                  }`}>
                  <ShieldCheck className="w-4 h-4 text-cyan-300" /> Treatment
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-mono">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="bg-white/5 border-cyan-500/30 text-white font-mono" required />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-mono">Time (12-hour)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-white/5 border-cyan-500/30 text-white font-mono"
                  required
                />
                <select value={ampm} onChange={(e) => setAmpm(e.target.value as "AM" | "PM")}
                  className="px-3 py-2 bg-white/5 border border-gray-700 rounded">
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white tracking-wider font-mono disabled:opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Scheduling..." : "Set Reminder"}
            </motion.button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
