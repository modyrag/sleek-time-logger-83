import { motion } from "framer-motion";
import { Clock, Calendar, Timer } from "lucide-react";

interface DashboardStatsProps {
  totalHours: number;
  daysPresent: number;
  averageHours: number;
}

const DashboardStats = ({ totalHours, daysPresent, averageHours }: DashboardStatsProps) => {
  const stats = [
    {
      label: "Total Hours",
      value: totalHours.toFixed(1),
      icon: Clock,
    },
    {
      label: "Days Present",
      value: daysPresent,
      icon: Calendar,
    },
    {
      label: "Avg Hours/Day",
      value: averageHours.toFixed(1),
      icon: Timer,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;