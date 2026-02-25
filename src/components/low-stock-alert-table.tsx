import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDashboardLowStock } from '@/features/admin/dashboard/api/dashboardApi';

export function LowStockAlertTable() {
  const { data: lowStockItems = [], isLoading } = useDashboardLowStock();

  return (
    <div className='px-4 lg:px-6 mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold tracking-tight'>Low Stock Alert</h2>
      </div>
      <div className='rounded-md border bg-card text-card-foreground'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className='text-right'>Remaining</TableHead>
              <TableHead className='text-right'>Status</TableHead>
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
            ) : lowStockItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-6 text-muted-foreground'
                >
                  No low stock items.
                </TableCell>
              </TableRow>
            ) : (
              lowStockItems.map((item) => (
                <TableRow key={item.productName + item.size}>
                  <TableCell className='font-medium'>
                    {item.productName}
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className='text-right text-destructive font-bold'>
                    {item.remaining}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge
                      variant={
                        item.status === 'Out of Stock' ||
                        item.status === 'Critical'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {item.status}
                    </Badge>
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
