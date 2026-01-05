import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLMotionProps<"div"> {
  hasHoverEffect?: boolean;
}

export const Card = ({ className, children, hasHoverEffect = false, ...props }: CardProps) => {
  return (
    <motion.div
        layout
        className={twMerge(
          "bg-surface/50 backdrop-blur-lg border border-white/5 rounded-2xl p-6",
          hasHoverEffect && "hover:border-primary/30 transition-colors",
          className
        )}
        {...props}
    >
      {children}
    </motion.div>
  );
};
