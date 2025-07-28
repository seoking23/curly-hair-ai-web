import { motion } from 'framer-motion'

export default function LoadingAnimation() {
  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <motion.svg
        width='80'
        height='80'
        viewBox='0 0 80 80'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        className='mb-8'
      >
        <motion.path
          d='M 20 60 Q 40 20 60 60 Q 70 75 40 75 Q 10 75 20 60'
          stroke='var(--primary, #8B4513)'
          strokeWidth='4'
          strokeLinecap='round'
          fill='none'
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.circle
          cx='40'
          cy='75'
          r='4'
          fill='var(--primary, #8B4513)'
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.svg>
      <motion.h2
        className='text-2xl font-bold text-primary mb-2'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Analyzing your beautiful curls...
      </motion.h2>
      <motion.p
        className='text-secondary max-w-xs mx-auto'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Our AI expert is examining your hair photos to create your personalized analysis
      </motion.p>
      <span className='sr-only'>Loading, please wait...</span>
    </div>
  );
} 