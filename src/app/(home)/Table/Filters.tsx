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
import { ApiFormOptions, FilterSchema, Session } from '@/types';
import { type Table } from '@tanstack/react-table';
import { Filter, Settings2, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const Filters = ({ table, apiOptions }: { table: Table<Session>; apiOptions: ApiFormOptions }) => {
  const isFiltered = useMemo(
    () => table.getState().columnFilters.length > 0,
    [table.getState().columnFilters.length]
  );

  const filterColumns = useMemo(() => {
    const fields: FilterSchema = {
      group: {
        name: 'group',
        label: 'Group',
        options: apiOptions.group ?? [],
        show: Boolean(apiOptions.group?.length),
        onChange: (value: string) => {
          table.getColumn('group')?.setFilterValue(value);
          table.getColumn('parentId')?.setFilterValue('');
          table.getColumn('batchId')?.setFilterValue('');
          table.resetPageIndex(true);
        },
      },
      parentId: {
        name: 'parentId',
        label: 'Parent Batch',
        options: [],
        show: false,
        onChange: (value: string) => {
          table.getColumn('parentId')?.setFilterValue(value);
          table.getColumn('batchId')?.setFilterValue('');
          table.resetPageIndex(true);
        },
      },
      batchId: {
        name: 'batchId',
        label: 'Quiz Batch',
        options: [],
        show: false,
        onChange: (value: string) => {
          table.getColumn('batchId')?.setFilterValue(value);
          table.resetPageIndex(true);
        },
      },
    };
    const groupFilter = table.getColumn('group')?.getFilterValue();
    const parentIdFilter = table.getColumn('parentId')?.getFilterValue();

    if (groupFilter) {
      const authGroupId = apiOptions.group?.find((item) => item.value === groupFilter)?.id;
      const filteredQuizBatchOptions =
        apiOptions?.batch?.filter((item) => item.groupId === authGroupId && !item.parentId) ?? [];
      fields.parentId.options = filteredQuizBatchOptions;
      fields.parentId.show = true;

      if (parentIdFilter) {
        const quizBatchId = apiOptions.batch?.find((item) => item.value === parentIdFilter)?.id;
        const filteredClassBatchOptions =
          apiOptions?.batch?.filter((item) => item.parentId === quizBatchId) ?? [];
        fields.batchId.options = filteredClassBatchOptions;
        fields.batchId.show = true;
      }
    }

    return Object.values(fields).filter((field) => field.show);
  }, [table.getState().columnFilters]);

  return (
    <div className="flex mb-4 gap-4 flex-col md:flex-row justify-between">
      <div className="flex items-center justify-normal gap-2 md:gap-4 flex-1">
        {filterColumns.map((column) => {
          return (
            <DropdownMenu modal={false} key={column.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm py-0 px-2 md:py-2 md:px-4">
                  <Filter className="mr-1 size-3" />
                  {column.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">
                  Filter By {column.label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={(table.getColumn(column.name)?.getFilterValue() as string) ?? ''}
                  onValueChange={column.onChange}
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  {(column.options ?? []).map((option) => (
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
          );
        })}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="text-sm py-0 px-2 md:py-2 md:px-4"
            onClick={() => table.resetColumnFilters(true)}
          >
            <span className="hidden md:inline">Reset</span>
            <X className="md:ml-2 size-4" aria-hidden="true" />
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
