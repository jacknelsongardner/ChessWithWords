// Popup.tsx
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Popup({ isOpen, onClose, children }: PopupProps) {
  return createPortal(
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

          {/* Centered popup */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       z-50 bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
            
            {/* <div style={{justifyContent: "center", alignItems: "center"}}>

              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              >
              I already know how to play
              </button>
            </div>*/}
            
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export { Popup };
