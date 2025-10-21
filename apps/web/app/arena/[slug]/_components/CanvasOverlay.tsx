import { ArenaUser } from '@/lib/validators/game';
import React, { useEffect, useState } from 'react'

export default function CanvasOverlay() {
  const [proximityUser, setProximityUser] = useState<ArenaUser | null>(null);

  useEffect(() => {
    const handleProximityUser = (evt: Event) => {
      const customEvent = evt as CustomEvent;
      const user = customEvent.detail;
      setProximityUser(user);
    }

    window.addEventListener('user-proximity', handleProximityUser);
    return () => {
      window.removeEventListener('user-proximity', handleProximityUser);
    }
  })
  return (
    <div>
      
    </div>
  )
}
