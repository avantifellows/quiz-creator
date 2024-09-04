import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Option, Session, STATUS } from '@/types';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import Link from 'next/link';
import { displayData } from '../ModalData';
import { CopyBtn } from './Actions';

export const SheetTableRow = ({
  table,
  formOptions,
  pendingSessions,
}: {
  table: TanStackTable<Session>;
  formOptions: Option[];
  pendingSessions: number[];
}) => {
  return table.getRowModel().rows.map((row) => (
    <Sheet key={row.id}>
      <>
        <SheetTrigger asChild>
          <TableRow
            className={cn(
              'cursor-pointer',
              row.original.id ? pendingSessions.includes(row.original.id) && 'opacity-50' : ''
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className='p-2'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        </SheetTrigger>
        <SheetContent className='w-full md:w-1/2 sm:max-w-none overflow-x-auto'>
          <SheetHeader className='border-b space-y-0 flex-row justify-between items-center mr-6'>
            <SheetTitle>Session Details</SheetTitle>
            <Link
              prefetch={false}
              href={`/session/edit?id=${row.original.id}`}
              className={`text-primary underline-offset-4 hover:underline ${row.original.meta_data?.status === STATUS.PENDING && 'opacity-50 pointer-events-none'}`}
              aria-disabled={row.original.meta_data?.status === STATUS.PENDING}
              tabIndex={row.original.meta_data?.status === STATUS.PENDING ? -1 : undefined}
            >
              Edit
            </Link>
          </SheetHeader>
          {displayData(row.original, formOptions).map((section, index) => (
            <div key={section.title + index} className='flex flex-col gap-2 py-4'>
              <h4 className='font-bold text-lg underline'>{section.title}</h4>
              <ul className='flex justify-between flex-wrap gap-y-4'>
                {section.data.map((item) => (
                  <li key={item.label + index} className='w-1/2 lg:w-1/3 pr-4 break-words'>
                    <h4 className='font-semibold capitalize inline-flex items-center flex-nowrap gap-1'>
                      {item.label}
                      {item.isLink ? <CopyBtn value={item.value} /> : null}
                    </h4>
                    {item.isLink ? (
                      <Link
                        href={item.value}
                        className='block truncate rounded-full border px-2.5 py-0.5 text-xs'
                        target='_blank'
                        rel='noopener noreferrer'
                        prefetch={false}
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p className='text-sm capitalize'>{item.value || 'N/A'}</p>
                    )}
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
