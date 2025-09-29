'use client';

import theme from '@/themes/theme';

export default function ShimmerGradient() {
  return (
    <>
      {/* Dark shimmer gradient overlay covering entire page */}
      <div 
        aria-hidden 
        className="pointer-events-none fixed inset-0 z-0 shimmer-gradient" 
        style={{
          background: `
            ${theme.gradients.shimmer.primary},
            ${theme.gradients.shimmer.radialBottom},
            ${theme.gradients.shimmer.radialTop}
          `,
          backgroundSize: '200% 200%',
          animation: 'shimmerMove 15s ease-in-out infinite'
        }}
      />
      
      <style jsx>{`
        @-webkit-keyframes shimmerMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @-moz-keyframes shimmerMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes shimmerMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </>
  );
}
