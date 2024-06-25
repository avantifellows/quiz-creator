import { Button } from '@/components/ui/button';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MyDateTimeProps } from '@/types';
import { format } from 'date-fns';
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

  return (
    <div className="flex flex-col gap-4">
      <FormLabel className="self-start">{label}</FormLabel>
      <Popover>
        <FormControl>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
              ref={refField}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, 'PPp') : <span>Pick a date and time</span>}
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="w-auto p-0">
          <Calendar
            {...restSchemaProps}
            {...restFieldProps}
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            disabled={disableRange}
          />
          <div className="p-3 border-t border-border">
            <TimePicker setDate={onChange} date={value} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
