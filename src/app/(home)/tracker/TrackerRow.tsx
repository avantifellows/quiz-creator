import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TableCell, TableRow } from '@/components/ui/table';
import { Option, Tracker } from '@/types';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import Link from 'next/link';
import { displayTrackerData } from './TrackerModalData';

export const TrackerSheetRow = ({
  table,
  formOptions,
}: {
  table: TanStackTable<Tracker>;
  formOptions: Option[];
}) => {
  return table.getRowModel().rows.map((row) => (
    <Sheet key={row.id}>
      <>
        <SheetTrigger asChild>
          <TableRow className='cursor-pointer'>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className='p-2'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        </SheetTrigger>
        <SheetContent className='w-full md:w-1/2 sm:max-w-none overflow-x-auto'>
          <SheetHeader className='border-b space-y-0 flex-row justify-between items-center mr-6'>
            <SheetTitle>Tracking Details</SheetTitle>
            <Link
              prefetch={false}
              href={`/tracker/edit?id=${row.original.id}`}
              className='text-primary underline-offset-4 hover:underline'
            >
              Edit
            </Link>
          </SheetHeader>
          {displayTrackerData(row.original, formOptions).map((section, index) => (
            <div key={section.title + index} className='flex flex-col gap-2 py-4'>
              <h4 className='font-bold text-lg underline'>{section.title}</h4>
              <ul className='flex justify-between flex-wrap gap-y-4'>
                {section.data.map((item) => (
                  <li key={item.label + index} className='w-1/2 lg:w-1/3 pr-4 break-words'>
                    <h4 className='font-semibold capitalize inline-flex items-center flex-nowrap gap-1'>
                      {item.label}
                    </h4>
                    <p className='text-sm capitalize'>{item.value || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SheetContent>
      </>
    </Sheet>
  ));
};
