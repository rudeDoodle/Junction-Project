import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type: 'warning' | 'success';
  onClose: () => void;
}

export default function NotificationToast({ message, type, onClose }: NotificationToastProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="absolute top-4 left-4 right-4 z-50"
    >
      <div className={`rounded-2xl p-4 shadow-2xl border-2 ${
        type === 'warning'
          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
          : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-6 h-6 ${
            type === 'warning' ? 'text-orange-600' : 'text-green-600'
          }`}>
            {type === 'warning' ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </div>
          <p className={`flex-1 ${
            type === 'warning' ? 'text-orange-900' : 'text-green-900'
          }`}>
            {message}
          </p>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
