
import { format } from "date-fns";
import { motion } from "framer-motion";

export interface AttendanceRecord {
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number;
  earnings?: number;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const AttendanceTable = ({ records }: AttendanceTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-left font-medium">Date</th>
            <th className="p-4 text-left font-medium">Check In</th>
            <th className="p-4 text-left font-medium">Check Out</th>
            <th className="p-4 text-left font-medium">Hours</th>
            <th className="p-4 text-left font-medium">Earnings ($)</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <motion.tr
              key={record.checkIn.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-t border-border hover:bg-muted/50 transition-colors"
            >
              <td className="p-4">{format(record.date, 'MMM dd, yyyy')}</td>
              <td className="p-4">{format(record.checkIn, 'HH:mm')}</td>
              <td className="p-4">
                {record.checkOut ? format(record.checkOut, 'HH:mm') : '-'}
              </td>
              <td className="p-4">{record.totalHours?.toFixed(1) || '-'}</td>
              <td className="p-4">{record.earnings?.toFixed(2) || '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
