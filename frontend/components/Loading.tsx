import { motion } from 'framer-motion'

interface LoadingProps {
  type?: 'spinner' | 'dots' | 'bar' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export default function Loading({
  type = 'spinner',
  size = 'md',
  text,
  fullScreen = false
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-ottoman-black/90 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex flex-col items-center justify-center py-8'

  // Spinner loader
  if (type === 'spinner') {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <svg
            className={`animate-spin ${sizeClasses[size]} text-white mx-auto`}
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {text && (
            <p className="mt-4 text-ottoman-cream/70 text-sm">{text}</p>
          )}
        </div>
      </div>
    )
  }

  // Dots loader
  if (type === 'dots') {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${
                  size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
                } bg-white rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          {text && (
            <p className="mt-4 text-ottoman-cream/70 text-sm">{text}</p>
          )}
        </div>
      </div>
    )
  }

  // Progress bar loader
  if (type === 'bar') {
    return (
      <div className={containerClass}>
        <div className="w-full max-w-md">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-white-light"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ width: '50%' }}
            />
          </div>
          {text && (
            <p className="mt-4 text-ottoman-cream/70 text-sm text-center">{text}</p>
          )}
        </div>
      </div>
    )
  }

  // Pulse loader (Ottoman logo style)
  if (type === 'pulse') {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <motion.div
            className={`${sizeClasses[size]} mx-auto`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-ottoman-red rounded-lg opacity-20 blur-xl" />
              <div className="absolute inset-0 border-4 border-white rounded-lg" />
              <div className="absolute inset-2 bg-gradient-to-br from-white/50 to-ottoman-red/50" />
            </div>
          </motion.div>
          {text && (
            <p className="mt-4 text-ottoman-cream/70 text-sm">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Simple inline spinner for buttons
export function ButtonSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="h-10 bg-white/10 rounded-lg w-1/3" />
          <div className="h-6 bg-white/10 rounded-lg w-1/2" />

          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-ottoman">
                <div className="h-48 bg-white/10 rounded-lg mb-4" />
                <div className="h-6 bg-white/10 rounded-lg mb-2" />
                <div className="h-4 bg-white/10 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
