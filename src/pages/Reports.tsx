
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface DayEarnings {
  date: string;
  amount: number;
}

const Reports = () => {
  const [weekEarnings, setWeekEarnings] = useState<DayEarnings[]>(() => {
    const stored = localStorage.getItem('weekEarnings');
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with current week
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        date: date.toISOString().split('T')[0],
        amount: 0
      };
    });
  });

  useEffect(() => {
    localStorage.setItem('weekEarnings', JSON.stringify(weekEarnings));
  }, [weekEarnings]);

  const handleAmountChange = (date: string, newAmount: string) => {
    setWeekEarnings(prev => 
      prev.map(day => 
        day.date === date 
          ? { ...day, amount: parseFloat(newAmount) || 0 }
          : day
      )
    );
  };

  const totalEarnings = weekEarnings.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8"
      >
        <h1 className="text-3xl font-bold mb-8">Earnings Report</h1>
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
                {weekEarnings.map((day) => (
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
                      />
                    </td>
                  </motion.tr>
                ))}
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
