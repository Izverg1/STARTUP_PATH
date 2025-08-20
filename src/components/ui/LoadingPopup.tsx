"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingPopupProps {
  message?: string;
  submessage?: string;
}

export function LoadingPopup({ 
  message = "Loading...", 
  submessage = "Optimizing your GTM strategy" 
}: LoadingPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-black/90 border border-red-500/30 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl shadow-red-500/20"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Loader */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-12 h-12 border border-red-400/20 border-b-red-400/60 rounded-full"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{message}</h3>
            <p className="text-sm text-gray-400">{submessage}</p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-800 rounded-full h-1">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-red-500 to-red-400 h-1 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}