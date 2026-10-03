import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { notice } = useStore();
  if (!notice) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon"><Check size={16} /></span>
      {notice}
    </div>
  );
}
