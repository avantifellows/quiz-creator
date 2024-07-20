'use client';

import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { type MyMultiSelectProps } from '@/types';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, X as RemoveIcon } from 'lucide-react';
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from 'react';
import { type ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FormControl, FormLabel } from './form';

export type MultiSelectorProps = {
  values: string[];
  onValuesChange: (value: string[]) => void;
  loop?: boolean;
} & React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

interface MultiSelectContextProps {
  value: string[];
  onValueChange: (value: any) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelect must be used within MultiSelectProvider');
  }
  return context;
};

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (value.includes(val)) {
        onValueChange(value.filter((item) => item !== val));
      } else {
        onValueChange([...value, val]);
      }
    },
    [value]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex);
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      if ((e.key === 'Backspace' || e.key === 'Delete') && value.length > 0) {
        if (inputValue.length === 0) {
          if (activeIndex !== -1 && activeIndex < value.length) {
            onValueChange(value.filter((item) => item !== value[activeIndex]));
            const newIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
            setActiveIndex(newIndex);
          } else {
            onValueChange(value.filter((item) => item !== value[value.length - 1]));
          }
        }
      } else if (e.key === 'Enter') {
        setOpen(true);
      } else if (e.key === 'Escape') {
        if (activeIndex !== -1) {
          setActiveIndex(-1);
        } else {
          setOpen(false);
        }
      } else if (dir === 'rtl') {
        if (e.key === 'ArrowRight') {
          movePrev();
        } else if (e.key === 'ArrowLeft' && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      } else {
        if (e.key === 'ArrowLeft') {
          movePrev();
        } else if (e.key === 'ArrowRight' && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      }
    },
    [value, inputValue, activeIndex, loop]
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn('overflow-visible bg-transparent flex flex-col', className)}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { value, onValueChange, activeIndex } = useMultiSelect();

    const mousePreventDefault = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {value.map((item, index) => (
          <Badge
            key={item}
            className={cn(
              'px-1 rounded-xl flex items-center gap-1',
              activeIndex === index && 'ring-2 ring-muted-foreground '
            )}
            variant={'secondary'}
          >
            <span className="text-xs">{item}</span>
            <button
              aria-label={`Remove ${item} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => onValueChange(item)}
            >
              <span className="sr-only">Remove {item} option</span>
              <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  }
);

MultiSelectorTrigger.displayName = 'MultiSelectorTrigger';

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const { setOpen, inputValue, setInputValue, activeIndex, setActiveIndex } = useMultiSelect();
  return (
    <CommandPrimitive.Input
      {...props}
      ref={ref}
      value={inputValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        'outline-none placeholder:text-muted-foreground/80 placeholder:italic flex-1 disabled:cursor-not-allowed disabled:opacity-50',
        className,
        activeIndex !== -1 && 'caret-transparent'
      )}
    />
  );
});

MultiSelectorInput.displayName = 'MultiSelectorInput';

const MultiSelectorContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children }, ref) => {
    const { open } = useMultiSelect();
    return (
      <div ref={ref} className="relative">
        {open && children}
      </div>
    );
  }
);

MultiSelectorContent.displayName = 'MultiSelectorContent';

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        'p-2 flex flex-col gap-2 rounded-md transition-colors w-full absolute bg-background shadow-md z-10 border border-muted top-0',
        className
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">No results found</span>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectorList.displayName = 'MultiSelectorList';

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, value, children, ...props }, ref) => {
  const { value: Options, onValueChange, setInputValue } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const isIncluded = Options.includes(value);

  console.log({ props, value, Options, isIncluded });

  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => {
        onValueChange(value);
        setInputValue('');
      }}
      className={cn(
        'w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground flex justify-between',
        isIncluded && 'opacity-50 cursor-default',
        props.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectorItem.displayName = 'MultiSelectorItem';

const ControlledMultiSelectField = React.forwardRef<
  React.ElementRef<typeof FormControl>,
  { field: ControllerRenderProps } & { schema: MyMultiSelectProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { value = [], onChange, ...restFieldProps } = field;
  const {
    type,
    label,
    disabled,
    options = [],
    onValueChange,
    helperText,
    ...restSchemaProps
  } = schema;

  React.useEffect(() => {
    if (value && onValueChange) {
      const value = form.watch(field.name);
      form.setValue(field.name, value, { shouldDirty: true });
      onValueChange(value, form);
    }
  }, [value, onValueChange]);

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <MultiSelector values={value} onValuesChange={onChange} loop={false}>
        <FormControl ref={ref}>
          <MultiSelectorTrigger>
            <MultiSelectorInput {...restSchemaProps} {...restFieldProps} />
          </MultiSelectorTrigger>
        </FormControl>
        <MultiSelectorContent>
          <MultiSelectorList>
            {options.length ? (
              <>
                {options.map((option) => (
                  <MultiSelectorItem key={option.value.toString()} value={option.value.toString()}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </>
            ) : (
              <MultiSelectorItem key="no-options" value="no-options">
                No options
              </MultiSelectorItem>
            )}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
    </>
  );
});

ControlledMultiSelectField.displayName = 'ControlledSelectField';

export {
  ControlledMultiSelectField,
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
};
