
import React from 'react';

const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-5.84-2.56m0 0a14.95 14.95 0 01-5.84-2.56m5.84 2.56v-4.82m0 4.82l-5.84 2.56M12 12a6 6 0 016-6h4.82a6 6 0 01-7.38 5.84M12 12a6 6 0 00-6 6v4.82a6 6 0 007.38-5.84M12 12h-4.82a6 6 0 00-5.84 7.38M12 12a6 6 0 016-6h4.82a6 6 0 01-7.38 5.84"
    />
  </svg>
);

export default TargetIcon;
