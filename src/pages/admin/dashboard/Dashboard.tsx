import { FeaturePlaceholder } from '@/components/app';

export default function DashboardPage() {
  return (
    <div className='px-4 py-4 lg:px-6'>
      <FeaturePlaceholder
        title='Admin dashboard foundation is in place'
        description='This route is protected and mounted, but its current shadcn sample analytics have been removed so the dashboard does not present fake business data.'
        items={[
          'Connect real KPI queries for revenue, orders, customers, and inventory.',
          'Decide which charts are actually useful for operations before reintroducing analytics widgets.',
          'Add server-driven loading and empty states per dashboard section.',
        ]}
      />
    </div>
  );
}
