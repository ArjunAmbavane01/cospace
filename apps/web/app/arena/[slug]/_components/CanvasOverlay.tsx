import { User } from 'better-auth';
import ProximityPanel from './overlay/ProximityPanel';

export default function CanvasOverlay({ adminUser }: { adminUser: User }) {
  return (
    <>
      <ProximityPanel adminUser={adminUser} />
    </>
  )
}
