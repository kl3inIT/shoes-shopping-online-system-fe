import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';

export function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();
  const appName = t('appName');
  const isMobile = useIsMobile();

  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className={cn('space-y-4', isMobile && 'text-center')}>
            <Link
              className={cn(
                'flex items-center gap-2',
                isMobile && 'justify-center'
              )}
              to='/'
            >
              <span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold tracking-tight text-transparent'>
                {appName}
              </span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              {t('footer.tagline', {
                defaultValue:
                  'Your one-stop shop for shoes. Premium products at competitive prices.',
              })}
            </p>
            <div className={cn('flex space-x-2', isMobile && 'justify-center')}>
              <Button
                asChild
                className='h-8 w-8 rounded-full'
                size='icon'
                variant='ghost'
              >
                <a
                  aria-label='Facebook'
                  href='https://facebook.com'
                  rel='noreferrer'
                  target='_blank'
                >
                  <FacebookIcon className='h-4 w-4' />
                </a>
              </Button>
              <Button
                asChild
                className='h-8 w-8 rounded-full'
                size='icon'
                variant='ghost'
              >
                <a
                  aria-label='Twitter'
                  href='https://twitter.com'
                  rel='noreferrer'
                  target='_blank'
                >
                  <X className='h-4 w-4' />
                </a>
              </Button>
              <Button
                asChild
                className='h-8 w-8 rounded-full'
                size='icon'
                variant='ghost'
              >
                <a
                  aria-label='Instagram'
                  href='https://instagram.com'
                  rel='noreferrer'
                  target='_blank'
                >
                  <InstagramIcon className='h-4 w-4' />
                </a>
              </Button>
              <Button
                asChild
                className='h-8 w-8 rounded-full'
                size='icon'
                variant='ghost'
              >
                <a
                  aria-label='GitHub'
                  href='https://github.com'
                  rel='noreferrer'
                  target='_blank'
                >
                  <GithubIcon className='h-4 w-4' />
                </a>
              </Button>
              <Button
                asChild
                className='h-8 w-8 rounded-full'
                size='icon'
                variant='ghost'
              >
                <a
                  aria-label='LinkedIn'
                  href='https://linkedin.com'
                  rel='noreferrer'
                  target='_blank'
                >
                  <LinkedinIcon className='h-4 w-4' />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>
              {t('footer.shop.title', { defaultValue: 'Shop' })}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products'
                >
                  {t('footer.shop.allProducts', {
                    defaultValue: 'All Products',
                  })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=running'
                >
                  {t('footer.shop.running', { defaultValue: 'Running' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=casual'
                >
                  {t('footer.shop.casual', { defaultValue: 'Casual' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=basketball'
                >
                  {t('footer.shop.basketball', {
                    defaultValue: 'Basketball',
                  })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=training'
                >
                  {t('footer.shop.training', { defaultValue: 'Training' })}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>
              {t('footer.company.title', { defaultValue: 'Company' })}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/about'
                >
                  {t('footer.company.about', { defaultValue: 'About Us' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/careers'
                >
                  {t('footer.company.careers', { defaultValue: 'Careers' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/blog'
                >
                  {t('footer.company.blog', { defaultValue: 'Blog' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/press'
                >
                  {t('footer.company.press', { defaultValue: 'Press' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/contact'
                >
                  {t('footer.company.contact', { defaultValue: 'Contact' })}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>
              {t('footer.support.title', { defaultValue: 'Support' })}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/help'
                >
                  {t('footer.support.help', { defaultValue: 'Help Center' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/shipping'
                >
                  {t('footer.support.shipping', {
                    defaultValue: 'Shipping & Returns',
                  })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/warranty'
                >
                  {t('footer.support.warranty', { defaultValue: 'Warranty' })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/privacy'
                >
                  {t('footer.support.privacy', {
                    defaultValue: 'Privacy Policy',
                  })}
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/terms'
                >
                  {t('footer.support.terms', {
                    defaultValue: 'Terms of Service',
                  })}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>
              {t('footer.copyright', {
                defaultValue: '© {{year}} {{appName}}. All rights reserved.',
                year: new Date().getFullYear(),
                appName,
              })}
            </p>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <Link className='hover:text-foreground' to='/privacy'>
                {t('footer.links.privacy', { defaultValue: 'Privacy' })}
              </Link>
              <Link className='hover:text-foreground' to='/terms'>
                {t('footer.links.terms', { defaultValue: 'Terms' })}
              </Link>
              <Link className='hover:text-foreground' to='/cookies'>
                {t('footer.links.cookies', { defaultValue: 'Cookies' })}
              </Link>
              <Link className='hover:text-foreground' to='/sitemap'>
                {t('footer.links.sitemap', { defaultValue: 'Sitemap' })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
