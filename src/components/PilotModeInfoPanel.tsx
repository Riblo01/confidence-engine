import { Info } from 'lucide-react';

export default function PilotModeInfoPanel() {
  return (
    <section className="mc-pilot-panel">
      <div>
        <Info size={15} />
        <strong>Pilot Mode: Adaptive Calibration</strong>
      </div>
      <p>
        Thresholds and weights can stay conservative while the system learns from feedback. Mission Control still
        demonstrates every route: trusted outputs proceed, uncertain outputs go to review, and unsafe outputs are blocked.
      </p>
      <ul>
        <li>Trusted threshold: 85</li>
        <li>Review threshold: 65</li>
        <li>Contradiction risk above 50 downgrades the verdict</li>
        <li>Critical missing evidence requires review or blocks automation</li>
      </ul>
    </section>
  );
}
