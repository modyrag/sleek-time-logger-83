import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8"
      >
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="bg-white rounded-xl p-6 border border-border">
          <p className="text-muted-foreground">
            Settings feature coming soon...
          </p>
        </div>
      </motion.div>
      <Navigation />
    </div>
  );
};

export default Settings;