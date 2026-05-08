import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { 
        y: -5, 
        rotateX: 2, 
        rotateY: -2,
        boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" 
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card rounded-3xl p-6 relative overflow-hidden group ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative z-10">{children}</div>
      
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );
};

export default GlassCard;
