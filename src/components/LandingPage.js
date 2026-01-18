import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LandingPage.css';

function LandingPage({ onStartRecording }) {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    if (clickCount === 0) {
      // First click: fade text, center and expand logo
      setClickCount(1);
    } else if (clickCount === 1) {
      // Second click: start recording
      onStartRecording();
    }
  };

  const isCentered = clickCount > 0;

  return (
    <div className="landing-page">
      <div className="logo-container">
        <motion.div 
          className="logo-icon" 
          onClick={handleLogoClick}
          initial={false}
          animate={{
            x: isCentered ? 150 : 0,
            scale: isCentered ? 1.3 : 1
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 60,
              damping: 20
            },
            scale: {
              type: "spring",
            stiffness: 60,
            damping: 20
            }
          }}
          whileHover={{ 
            scale: isCentered ? 1.35 : 1.05
          }}
          whileTap={{ 
            scale: isCentered ? 1.3 : 0.98
          }}
        >
          <img 
            src="/righthand.png" 
            alt="RightHand Icon" 
            className="logo-image"
          />
        </motion.div>
        <AnimatePresence mode="wait">
          {!isCentered && (
            <motion.div 
              className="logo-text"
              initial={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                x: -150, 
                scale: 0.7 
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8
              }}
            >
              <img 
                src="/righthand text.png" 
                alt="RightHand Text" 
                className="logo-text-image"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LandingPage;