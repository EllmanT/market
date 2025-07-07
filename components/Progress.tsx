import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

function ProcessingItem({ fileName }: { fileName: string }) {
  const [progress, setProgress] = useState(0);

useEffect(() => {
    const duration = 30000; // 30 seconds
    const totalSteps = 100;
    const interval = (duration / totalSteps); // 300ms per step

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setProgress(current);
      if (current >= 100) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <li className='flex items-center  text-sm text-gray-700'>
      <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
      Processing {fileName}.... <span className='ml-2 font-mono text-green-900'>{progress}%</span>
    </li>
  );
}

export default ProcessingItem;
