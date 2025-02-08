
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AttendanceButton from "@/components/AttendanceButton";
import AttendanceTable from "@/components/AttendanceTable";
import DashboardStats from "@/components/DashboardStats";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AttendanceRecord } from "@/components/AttendanceTable";
import { useToast } from "@/components/ui/use-toast";
import { isSameDay } from "date-fns";

const STORAGE_KEY = "attendance_data";
const CHECKIN_KEY = "current_checkin";
const IS_CHECKED_IN_KEY = "is_checked_in";

const Index = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((record: any) => ({
        ...record,
        date: new Date(record.date),
        checkIn: new Date(record.checkIn),
        checkOut: record.checkOut ? new Date(record.checkOut) : undefined,
        earnings: record.earnings || 0,
      }));
    }
    return [];
  });

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem(IS_CHECKED_IN_KEY) === "true";
  });

  const [currentCheckIn, setCurrentCheckIn] = useState<Date | null>(() => {
    const saved = localStorage.getItem(CHECKIN_KEY);
    return saved ? new Date(saved) : null;
  });

  const [todayEarnings, setTodayEarnings] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(IS_CHECKED_IN_KEY, isCheckedIn.toString());
  }, [isCheckedIn]);

  useEffect(() => {
    if (currentCheckIn) {
      localStorage.setItem(CHECKIN_KEY, currentCheckIn.toISOString());
    } else {
      localStorage.removeItem(CHECKIN_KEY);
    }
  }, [currentCheckIn]);

  const handleCheckIn = () => {
    const now = new Date();
    
    const todayRecord = records.find(record => isSameDay(record.date, now));
    if (todayRecord) {
      toast({
        title: "Already Checked In",
        description: "You've already recorded attendance for today",
        variant: "destructive",
      });
      return;
    }

    setCurrentCheckIn(now);
    setIsCheckedIn(true);
    toast({
      title: "Checked In",
      description: `Successfully checked in at ${now.toLocaleTimeString()}`,
    });
  };

  const handleCheckOut = () => {
    if (!currentCheckIn) return;
    
    const now = new Date();
    const newRecord: AttendanceRecord = {
      date: new Date(),
      checkIn: currentCheckIn,
      checkOut: now,
      totalHours: (now.getTime() - currentCheckIn.getTime()) / (1000 * 60 * 60),
      earnings: todayEarnings,
    };

    setRecords([newRecord, ...records]);
    setIsCheckedIn(false);
    setCurrentCheckIn(null);
    setTodayEarnings(0);
    
    toast({
      title: "Checked Out",
      description: `Successfully checked out at ${now.toLocaleTimeString()}`,
    });
  };

  const totalHours = records.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  const daysPresent = records.length;
  const averageHours = daysPresent ? totalHours / daysPresent : 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8 space-y-8"
      >
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold"
          >
            Attendance Tracker
          </motion.h1>
          <p className="text-muted-foreground">
            Track your work hours and earnings efficiently
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AttendanceButton
              type="check-in"
              onClick={handleCheckIn}
              disabled={isCheckedIn}
            />
            <AttendanceButton
              type="check-out"
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
            />
          </div>

          {isCheckedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h2 className="text-lg font-semibold mb-4">Today's Earnings</h2>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  value={todayEarnings}
                  onChange={(e) => setTodayEarnings(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="max-w-[200px]"
                />
                <span className="text-muted-foreground">$</span>
              </div>
            </motion.div>
          )}

          <DashboardStats
            totalHours={totalHours}
            daysPresent={daysPresent}
            averageHours={averageHours}
          />

          {records.length > 0 ? (
            <AttendanceTable records={records} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No attendance records yet
            </div>
          )}
        </div>
      </motion.div>
      <Navigation />
    </div>
  );
};

export default Index;
