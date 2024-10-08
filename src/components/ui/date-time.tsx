import { Button } from '@/components/ui/button';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ALLOWED_YEARS } from '@/Constants';
import { cn } from '@/lib/utils';
import { MyDateTimeProps } from '@/types';
import { addDays, addYears, format, startOfToday } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ElementRef, forwardRef } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Calendar } from './calendar';
import { TimePicker } from './time-picker';

const DateTimePicker = forwardRef<
  ElementRef<typeof FormControl>,
  { schema: MyDateTimeProps } & { field: ControllerRenderProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { value, onChange, ref: refField, ...restFieldProps } = field;
  const { label, disabled, disableRange, ...restSchemaProps } = schema;

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!value) {
      onChange?.(newDay);
      return;
    }
    const diff = newDay.getTime() - value.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = addDays(value, Math.ceil(diffInDays));
    onChange?.(newDateFull);
  };

  return (
    <div
      className='flex flex-col sm:flex-row gap-4 sm:gap-10 sm:items-center'
      id={restFieldProps.name}
    >
      <div className='flex flex-col gap-4 flex-1'>
        <FormLabel className='self-start'>{label?.date}</FormLabel>
        <Popover>
          <FormControl>
            <PopoverTrigger asChild>
              <Button
                {...restFieldProps}
                id={`${restFieldProps.name}-button`}
                variant='outline'
                className={cn('justify-start text-left font-normal')}
                ref={refField}
                disabled={disabled}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {value ? (
                  format(value, 'PP')
                ) : (
                  <span className='text-muted-foreground/80 italic font-medium'>
                    Pick a date and time
                  </span>
                )}
              </Button>
            </PopoverTrigger>
          </FormControl>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              {...restSchemaProps}
              {...restFieldProps}
              id={`${restFieldProps.name}-calendar`}
              captionLayout='dropdown-buttons'
              fromYear={startOfToday().getFullYear()}
              toYear={addYears(startOfToday(), ALLOWED_YEARS).getFullYear()}
              mode='single'
              selected={value}
              onSelect={(d) => handleSelect(d)}
              onMonthChange={handleSelect}
              initialFocus
              disabled={disableRange}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-col gap-4 flex-1'>
        <FormLabel className='self-start'>{label?.time}</FormLabel>
        <TimePicker setDate={onChange} date={value} />
      </div>
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
