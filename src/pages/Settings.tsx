
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(() => {
    return localStorage.getItem("hourly_rate") || "";
  });
  const { toast } = useToast();

  const handleSaveHourlyRate = () => {
    localStorage.setItem("hourly_rate", hourlyRate);
    toast({
      title: "Settings Saved",
      description: "Your hourly rate has been updated successfully.",
    });
  };

  const handleClearData = () => {
    const confirm = window.confirm(
      "Are you sure you want to clear all attendance data? This action cannot be undone."
    );
    if (confirm) {
      localStorage.removeItem("attendance_data");
      localStorage.removeItem("current_checkin");
      localStorage.removeItem("is_checked_in");
      toast({
        title: "Data Cleared",
        description: "All attendance data has been cleared successfully.",
      });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8"
      >
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Default Hourly Rate ($)</Label>
                <div className="flex gap-4">
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="Enter your hourly rate"
                    className="max-w-[200px]"
                  />
                  <Button onClick={handleSaveHourlyRate}>Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This rate will be used to calculate your earnings automatically.
                </p>
              </div>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="bg-card rounded-xl p-6 border border-border">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold">Danger Zone</h2>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h3 className="font-medium text-destructive mb-2">Clear All Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will permanently delete all your attendance records and settings.
                      This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleClearData}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </motion.div>
      <Navigation />
    </div>
  );
};

export default Settings;
