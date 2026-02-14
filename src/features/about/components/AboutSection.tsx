import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

export interface AboutFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface AboutSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  features?: AboutFeature[];
  image?: string;
  imagePosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export function AboutSection({
  title,
  subtitle,
  description,
  features,
  image,
  imagePosition = 'right',
  children,
}: AboutSectionProps) {
  const Content = () => (
    <div className='space-y-6'>
      {subtitle && (
        <p className='text-sm font-medium uppercase tracking-wider text-primary'>
          {subtitle}
        </p>
      )}
      <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
      {description && (
        <p className='text-lg text-muted-foreground'>{description}</p>
      )}

      {features && features.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardContent className='flex items-start gap-4 pt-6'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                    <Icon className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-medium'>{feature.title}</h3>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {children}
    </div>
  );

  if (!image) {
    return (
      <section className='py-12'>
        <Content />
      </section>
    );
  }

  return (
    <section className='py-12'>
      <div
        className={`grid items-center gap-8 lg:grid-cols-2 ${
          imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {imagePosition === 'left' && (
          <div className='overflow-hidden rounded-lg'>
            <img
              src={image}
              alt={title}
              className='h-full w-full object-cover'
            />
          </div>
        )}

        <Content />

        {imagePosition === 'right' && (
          <div className='overflow-hidden rounded-lg'>
            <img
              src={image}
              alt={title}
              className='h-full w-full object-cover'
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
