import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  onPageChange: (pageIndex: number) => void
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-end gap-5">
      <div className="flex w-28 items-center justify-center text-sm font-medium">
        Página {pageIndex + 1} de {pageCount}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => {
            table.setPageIndex(0)
            onPageChange(0)
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para a primeira página</span>
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => {
            table.previousPage()
            onPageChange(pageIndex - 1)
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para a página anterior</span>
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => {
            table.nextPage()
            onPageChange(pageIndex + 1)
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para a próxima página</span>
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1)
            onPageChange(pageCount - 1)
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para a última página</span>
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
