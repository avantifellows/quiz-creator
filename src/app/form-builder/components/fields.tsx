'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Lang, LangText } from '../lib/types';

/**
 * Paired multilingual input row: English always, Hindi beside it when enabled. This is the
 * builder's answer to the sheet's error-prone line-break-stacked bilingual cells — clean,
 * separate fields the author can't mis-order.
 */
export function PairedInput({
  text,
  hiEnabled,
  onChange,
  enPlaceholder,
  hiPlaceholder,
  className,
  inputClassName,
}: {
  text: LangText;
  hiEnabled: boolean;
  onChange: (lang: Lang, value: string) => void;
  enPlaceholder: string;
  hiPlaceholder: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-2', hiEnabled && 'sm:grid-cols-2', className)}>
      <Input
        value={text.en}
        onChange={(e) => onChange('en', e.target.value)}
        placeholder={enPlaceholder}
        className={inputClassName}
      />
      {hiEnabled && (
        <Input
          value={text.hi}
          onChange={(e) => onChange('hi', e.target.value)}
          placeholder={hiPlaceholder}
          className={inputClassName}
        />
      )}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
      {children}
    </Label>
  );
}
