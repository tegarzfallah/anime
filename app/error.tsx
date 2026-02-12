'use client';

import { ErrorState } from '@/components/ui/state';

export default function GlobalError() {
  return <ErrorState message="Something went wrong while loading this page." />;
}
