import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TableCell, TableRow } from '@/components/ui/table';
import { Session } from '@/types';
import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import Link from 'next/link';
import { displayData } from './Columns';

export const SheetTableRow = ({ table }: { table: TanStackTable<Session> }) => {
  return table.getRowModel().rows.map((row) => (
    <Sheet key={row.id}>
      <>
        <SheetTrigger asChild>
          <TableRow className="cursor-pointer">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        </SheetTrigger>
        <SheetContent className="w-full md:w-1/2 sm:max-w-none overflow-x-auto">
          <SheetHeader className="border-b text-center sm:text-center">
            <SheetTitle>Session Details</SheetTitle>
          </SheetHeader>
          {displayData(row.original).map((section, index) => (
            <div key={section.title + index} className="flex flex-col gap-2 py-4">
              <h4 className="font-bold text-lg underline">{section.title}</h4>
              <ul className="flex justify-between flex-wrap gap-y-2">
                {section.data.map((item) => (
                  <li key={item.label + index} className="w-1/2 lg:w-1/3 pr-4">
                    <h4 className="font-semibold capitalize">{item.label}</h4>
                    {item.isLink ? (
                      <Link
                        href={item.value}
                        className="block truncate rounded-full border px-2.5 py-0.5 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p className="text-sm capitalize">{item.value || 'N/A'}</p>
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
