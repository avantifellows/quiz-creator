import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tracker } from '@/types';
import { type Table } from '@tanstack/react-table';
import { Filter, Settings2, X } from 'lucide-react';
import { useMemo } from 'react';

export const TrackerFilters = ({ table }: { table: Table<Tracker> }) => {
  const isFiltered = useMemo(
    () => table.getState().columnFilters.length > 0,
    [table.getState().columnFilters.length]
  );

  // Session type options
  const sessionTypeOptions = [
    { value: 'Operations', label: 'Operations' },
    { value: 'Academics', label: 'Academics' },
  ];

  return (
    <div className='flex mb-4 gap-4 flex-wrap justify-between'>
      <div className='flex items-center justify-normal gap-2 md:gap-4 flex-1 flex-wrap'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='text-sm py-0 px-2 md:py-2 md:px-4'>
              <Filter className='mr-1 size-3' />
              Tracker Session Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel className='text-center'>
              Filter By Tracker Session Type
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={(table.getColumn('tracker_session_type')?.getFilterValue() as string) ?? ''}
              onValueChange={(value) => {
                table.getColumn('tracker_session_type')?.setFilterValue(value);
                table.resetPageIndex(true);
              }}
            >
              <DropdownMenuRadioItem value=''>All</DropdownMenuRadioItem>
              {sessionTypeOptions.map((option) => (
                <DropdownMenuRadioItem
                  className='capitalize'
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='ghost'
            className='text-sm py-0 px-2 md:py-2 md:px-4'
            onClick={() => table.resetColumnFilters(true)}
          >
            <span className='hidden md:inline'>Reset</span>
            <X className='md:ml-2 size-4' aria-hidden='true' />
          </Button>
        )}
      </div>

      <div className='flex items-center justify-between gap-2 md:gap-4'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              <Settings2 className='mr-2 size-4' />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef?.header?.toString()}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
