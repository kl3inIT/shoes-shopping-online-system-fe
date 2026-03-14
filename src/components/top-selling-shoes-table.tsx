import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDashboardTopSelling } from '@/features/admin/dashboard/api/dashboardApi';

export function TopSellingShoesTable() {
  const { data: topSelling = [], isLoading } = useDashboardTopSelling();

  return (
    <div className='px-4 lg:px-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold tracking-tight'>Top Selling Shoes</h2>
      </div>
      <div className='rounded-md border bg-card text-card-foreground'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className='text-right'>Total Sold</TableHead>
              <TableHead className='text-right'>Current Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : topSelling.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  No selling data.
                </TableCell>
              </TableRow>
            ) : (
              topSelling.map((shoe) => (
                <TableRow key={shoe.productName + shoe.categoryName}>
                  <TableCell className='font-medium'>
                    {shoe.productName}
                  </TableCell>
                  <TableCell>{shoe.categoryName}</TableCell>
                  <TableCell className='text-right'>{shoe.totalSold}</TableCell>
                  <TableCell className='text-right'>
                    {shoe.currentStock}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
