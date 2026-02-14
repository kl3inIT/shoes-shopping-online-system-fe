import { useTranslation } from 'react-i18next';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function AboutPage() {
  const { t } = useTranslation();

  const features = [
    { icon: Truck, key: 'freeShipping' },
    { icon: Shield, key: 'authentic' },
    { icon: RefreshCw, key: 'easyReturns' },
    { icon: Headphones, key: 'support' },
  ];

  const faqKeys = [
    'trackOrder',
    'returnPolicy',
    'findSize',
    'authentic',
    'paymentMethods',
    'shippingTime',
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Hero Section */}
      <section className='py-12'>
        <div className='space-y-6'>
          <p className='text-sm font-medium uppercase tracking-wider text-primary'>
            {t('about.hero.subtitle')}
          </p>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('about.hero.title')}
          </h1>
          <p className='text-lg text-muted-foreground'>
            {t('about.hero.description')}
          </p>

          {/* Features Grid */}
          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.key}>
                  <CardContent className='flex items-start gap-4 pt-6'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <h3 className='font-medium'>
                        {t(`about.features.${feature.key}.title`)}
                      </h3>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        {t(`about.features.${feature.key}.description`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator className='my-8' />

      {/* Mission & Vision */}
      <div className='grid gap-8 md:grid-cols-2'>
        <section className='py-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            {t('about.mission.title')}
          </h2>
          <p className='mt-4 text-lg text-muted-foreground'>
            {t('about.mission.description')}
          </p>
        </section>
        <section className='py-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            {t('about.vision.title')}
          </h2>
          <p className='mt-4 text-lg text-muted-foreground'>
            {t('about.vision.description')}
          </p>
        </section>
      </div>

      <Separator className='my-8' />

      {/* FAQs */}
      <section className='py-12'>
        <h2 className='mb-8 text-center text-3xl font-bold'>
          {t('about.faq.title')}
        </h2>
        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='w-full'>
            {faqKeys.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className='text-left'>
                  {t(`about.faq.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground'>
                  {t(`about.faq.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
