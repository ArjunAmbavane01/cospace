'use client';

import { useEffect, useState } from 'react';
import { Laptop } from 'lucide-react';

export default function ViewportGuard({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(true);
  const MIN_WIDTH = 1024;

  useEffect(() => {
    const checkViewport = () => {
      setIsSupported(window.innerWidth >= MIN_WIDTH);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // to start both server and reduce cold start latency
  useEffect(() => {
    const urls = [
      `${process.env.NEXT_PUBLIC_WS_BACKEND_URL}/health`,
      `${process.env.NEXT_PUBLIC_WEBRTC_BACKEND_URL}/health`,
    ];
    urls.forEach(url => {
      fetch(url, { method: 'GET', keepalive: true });
    });
  }, []);


  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="space-y-5 max-w-md w-full p-8 bg-white text-center text-primary-foreground rounded-2xl shadow-xl">
          <div className="flex items-center justify-center p-3 mx-auto size-16 bg-blue-500 border border-blue-800 rounded-full">
            <Laptop className='size-10 text-foreground' />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2>
              Desktop Experience Required
            </h2>
            <h5>
              We currently support desktop and laptop devices only
            </h5>
          </div>

          {/* Description */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Our immersive virtual space experience is optimized for larger screens
              to ensure the best collaboration and interaction. Please access this
              application from a laptop or desktop computer.
            </p>
          </div>

          {/* Features list */}
          <div className="text-left space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Minimum Requirements
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Screen width: 1024px or larger
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Laptop or desktop device
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Modern web browser
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Mobile support is coming soon. Thank you for your understanding.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}