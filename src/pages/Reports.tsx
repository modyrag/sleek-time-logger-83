
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, LineChart, BarChart } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STORAGE_KEY = "attendance_data";

const Reports = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((record: any) => ({
        ...record,
        date: new Date(record.date),
        checkIn: new Date(record.checkIn),
        checkOut: record.checkOut ? new Date(record.checkOut) : undefined,
      }));
    }
    return [];
  });

  // Update records when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecords(parsed.map((record: any) => ({
          ...record,
          date: new Date(record.date),
          checkIn: new Date(record.checkIn),
          checkOut: record.checkOut ? new Date(record.checkOut) : undefined,
        })));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');
  const weekRange = `${format(currentWeekStart, 'MMM dd')} - ${
    format(addWeeks(currentWeekStart, 1), 'MMM dd, yyyy')
  }`;

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const weekEarnings = records.map(record => ({
    name: format(record.date, 'EEE'),
    amount: record.earnings || 0,
    date: format(record.date, 'MMM dd, yyyy'),
  }));

  const totalEarnings = weekEarnings.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8 space-y-8"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Earnings Analysis</h1>
            <p className="text-muted-foreground">Weekly earnings overview and trends</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{weekRange}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border bg-muted/50">
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                  <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                </Card>
                <Card className="p-4 border bg-muted/50">
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                  <div className="text-2xl font-bold">
                    ${(totalEarnings / Math.max(weekEarnings.length, 1)).toFixed(2)}
                  </div>
                </Card>
                <Card className="p-4 border bg-muted/50">
                  <div className="text-sm text-muted-foreground">Best Day</div>
                  <div className="text-2xl font-bold">
                    ${Math.max(...weekEarnings.map(d => d.amount), 0).toFixed(2)}
                  </div>
                </Card>
              </div>

              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={weekEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-4 text-left font-medium text-muted-foreground">Day</th>
                      <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-left font-medium text-muted-foreground">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {weekEarnings.map((day) => (
                      <motion.tr
                        key={day.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card"
                      >
                        <td className="px-6 py-4 text-sm">
                          {day.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${day.amount.toFixed(2)}
                        </td>
                      </motion.tr>
                    ))}
                    <tr className="bg-muted font-medium">
                      <td colSpan={2} className="px-6 py-4">
                        Weekly Total
                      </td>
                      <td className="px-6 py-4">
                        ${totalEarnings.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
      <Navigation />
    </div>
  );
};

export default Reports;
