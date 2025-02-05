import { motion } from "framer-motion";
import { Clock, LogOut } from "lucide-react";

interface AttendanceButtonProps {
  type: "check-in" | "check-out";
  onClick: () => void;
  disabled?: boolean;
}

const AttendanceButton = ({ type, onClick, disabled }: AttendanceButtonProps) => {
  const isCheckIn = type === "check-in";
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 rounded-2xl flex items-center justify-center gap-3
        text-xl font-medium transition-colors
        ${isCheckIn 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isCheckIn ? <Clock className="w-6 h-6" /> : <LogOut className="w-6 h-6" />}
      {isCheckIn ? 'Check In' : 'Check Out'}
    </motion.button>
  );
};

export default AttendanceButton;