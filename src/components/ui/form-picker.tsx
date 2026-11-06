'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { MyFormPickerProps } from '@/types';
import type { FormSummary } from '@/app/form-builder/lib/definition';
import { getForm, listForms } from '@/services/forms';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { FormControl, FormLabel } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const LANG_LABEL: Record<string, string> = { en: 'EN', hi: 'HI' };

const describe = (
  form: Pick<FormSummary, 'languages' | 'question_count' | 'updated_at'> &
    Partial<Pick<FormSummary, 'created_by'>>
) =>
  [
    form.languages.map((l) => LANG_LABEL[l] ?? l).join(' · '),
    `${form.question_count} questions`,
    `updated ${new Date(form.updated_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`,
    form.created_by,
  ]
    .filter(Boolean)
    .join(' · ');

/**
 * Pick a saved form-builder form for a form session (decision D12): searchable on the server,
 * newest first, only forms complete enough to use (`ready`). Stores the form id in the field
 * and the form's languages in `formLanguages`, which decides the languages the Form Language
 * dropdown offers (D21).
 */
const ControlledFormPicker = ({
  field,
  form,
  schema,
}: {
  field: ControllerRenderProps;
  form: UseFormReturn;
  schema: MyFormPickerProps;
}) => {
  const { label, disabled, placeholder = 'Select a form' } = schema;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<FormSummary[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<Pick<FormSummary, 'title'> | null>(null);

  // A form already chosen (edit / duplicate / going back a step): show its name and languages.
  React.useEffect(() => {
    if (!field.value || selected) return;
    let cancelled = false;
    getForm(field.value).then((found) => {
      if (cancelled || !found) return;
      setSelected({ title: found.title });
      form.setValue('formLanguages', found.languages);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  // Search as the PM types, one request per pause.
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const { items } = await listForms({ search, readyOnly: true, limit: 20 });
      if (!cancelled) {
        setResults(items);
        setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, search]);

  function choose(picked: FormSummary) {
    field.onChange(picked._id);
    setSelected({ title: picked.title });
    form.setValue('formLanguages', picked.languages);
    // A language the newly picked form doesn't have falls back to English.
    if (!picked.languages.includes(form.getValues('formLanguage')))
      form.setValue('formLanguage', 'en');
    setOpen(false);
  }

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type='button'
              variant='outline'
              role='combobox'
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                'w-full justify-between font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              <span className='truncate'>
                {field.value ? (selected?.title ?? 'Loading…') : placeholder}
              </span>
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
          {/* Filtering happens on the server, so cmdk must not filter again. */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search forms by title'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {!loading && <CommandEmpty>No ready forms match.</CommandEmpty>}
              {loading && <p className='py-6 text-center text-sm'>Searching…</p>}
              {!loading && results.length > 0 && (
                <CommandGroup>
                  {results.map((result) => (
                    <CommandItem
                      key={result._id}
                      value={result._id}
                      onSelect={() => choose(result)}
                      className='flex items-start gap-2'
                    >
                      <Check
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          field.value === result._id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className='flex flex-col'>
                        <span className='font-medium'>{result.title}</span>
                        <span className='text-xs text-muted-foreground'>{describe(result)}</span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export { ControlledFormPicker };
