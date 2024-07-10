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
import { Input } from '@/components/ui/input';
import { ExtendedOptions, Session } from '@/types';
import { type Table } from '@tanstack/react-table';
import { Filter, Settings2, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const Filters = ({
  table,
  groupOptions,
}: {
  table: Table<Session>;
  groupOptions: ExtendedOptions[];
}) => {
  const isFiltered = useMemo(() => table.getState().columnFilters.length > 0, [table]);

  return (
    <div className="flex mb-4 gap-4 flex-col md:flex-row justify-between">
      <div className="flex items-center justify-normal gap-2 md:gap-4 flex-1">
        <Input
          placeholder="Filter Using Name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Group
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">Filter By Group</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={(table.getColumn('group')?.getFilterValue() as string) ?? ''}
              onValueChange={(value) => table.getColumn('group')?.setFilterValue(value)}
            >
              <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
              {groupOptions.map((option) => (
                <DropdownMenuRadioItem
                  className="capitalize"
                  key={option.value.toString()}
                  value={option.value.toString()}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 md:gap-4">
        <Button asChild>
          <Link href={'/session/create?step=basic'}>+ Create Session</Link>
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings2 className="mr-2 size-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
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

export default Filters;

// <DropdownMenuCheckboxItem
//   key={column.id}
//   className="capitalize"
//   checked={column.getIsVisible()}
//   onCheckedChange={(value) => column.toggleVisibility(!!value)}
// >
//   {column.columnDef?.header?.toString()}
// </DropdownMenuCheckboxItem>
