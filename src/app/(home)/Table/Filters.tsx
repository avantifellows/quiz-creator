import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Session } from '@/types';
import { type Table } from '@tanstack/react-table';
import { Settings2, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const Filters = ({ table }: { table: Table<Session> }) => {
  const isFiltered = useMemo(() => table.getState().columnFilters.length > 0, [table]);

  return (
    <div className="flex mb-4 gap-4 flex-col md:flex-row justify-between">
      <div className="flex items-center justify-between gap-2 md:gap-4 flex-1">
        <Input
          placeholder="Filter Using Group..."
          value={(table.getColumn('group')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('group')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
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
        <DropdownMenu>
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
