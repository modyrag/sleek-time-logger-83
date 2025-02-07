
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { format, startOfWeek, addWeeks, subWeeks, isSameDay, startOfToday } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayEarnings {
  date: string;
  amount: number;
}

const Reports = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return startOfWeek(new Date(), { weekStartsOn: 1 }); // Start week on Monday
  });

  const [allEarnings, setAllEarnings] = useState<Record<string, DayEarnings[]>>(() => {
    const stored = localStorage.getItem('allEarnings');
    return stored ? JSON.parse(stored) : {};
  });

  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');

  // Initialize week data if it doesn't exist
  useEffect(() => {
    if (!allEarnings[currentWeekKey]) {
      setAllEarnings(prev => ({
        ...prev,
        [currentWeekKey]: Array.from({ length: 7 }).map((_, index) => {
          const date = new Date(currentWeekStart);
          date.setDate(currentWeekStart.getDate() + index);
          return {
            date: date.toISOString().split('T')[0],
            amount: 0
          };
        })
      }));
    }
  }, [currentWeekKey, currentWeekStart]);

  useEffect(() => {
    localStorage.setItem('allEarnings', JSON.stringify(allEarnings));
  }, [allEarnings]);

  const handleAmountChange = (date: string, newAmount: string) => {
    setAllEarnings(prev => ({
      ...prev,
      [currentWeekKey]: prev[currentWeekKey].map(day => 
        day.date === date 
          ? { ...day, amount: parseFloat(newAmount) || 0 }
          : day
      )
    }));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const weekEarnings = allEarnings[currentWeekKey] || [];
  const totalEarnings = weekEarnings.reduce((sum, day) => sum + day.amount, 0);

  const weekRange = `${format(currentWeekStart, 'MMM dd')} - ${
    format(addWeeks(currentWeekStart, 1), 'MMM dd, yyyy')
  }`;

  const today = startOfToday();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Earnings Report</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">{weekRange}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-white rounded-xl p-6 border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-medium">Day</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {weekEarnings.map((day) => {
                  const dayDate = new Date(day.date);
                  const isToday = isSameDay(dayDate, today);

                  return (
                    <motion.tr
                      key={day.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-border"
                    >
                      <td className="p-4">
                        {format(new Date(day.date), 'EEEE')}
                      </td>
                      <td className="p-4">
                        {format(new Date(day.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          value={day.amount}
                          onChange={(e) => handleAmountChange(day.date, e.target.value)}
                          className="w-32"
                          min="0"
                          step="0.01"
                          disabled={!isToday}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
                <tr className="border-t border-border bg-muted">
                  <td colSpan={2} className="p-4 font-bold">
                    Weekly Total
                  </td>
                  <td className="p-4 font-bold">
                    ${totalEarnings.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
      <Navigation />
    </div>
  );
};

export default Reports;
