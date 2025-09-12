// Popup.tsx
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Popup({ isOpen, onClose, children }: PopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Greyed-out background */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // close if you click outside
          />

          {/* Popup content */}
          <motion.div
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 
                       bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export {Popup}