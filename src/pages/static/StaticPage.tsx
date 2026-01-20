export function StaticPage({ title }: { title: string }) {
  return (
    <section className='space-y-2'>
      <h1 className='text-2xl font-semibold'>{title}</h1>
      <p className='text-muted-foreground'>Page placeholder.</p>
    </section>
  );
}
