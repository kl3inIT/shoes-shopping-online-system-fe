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

export function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();
  const appName = t('appName');

  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <Link className='flex items-center gap-2' to='/'>
              <span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold tracking-tight text-transparent'>
                {appName}
              </span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              Your one-stop shop for shoes. Premium products at competitive
              prices.
            </p>
            <div className='flex space-x-2'>
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
            <h3 className='mb-4 text-sm font-semibold'>Shop</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products'
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=audio'
                >
                  Audio
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=wearables'
                >
                  Wearables
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=smartphones'
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/products?category=laptops'
                >
                  Laptops
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/about'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/careers'
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/blog'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/press'
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/contact'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>Support</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/help'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/shipping'
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/warranty'
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/privacy'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className='text-muted-foreground hover:text-foreground'
                  to='/terms'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </p>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <Link className='hover:text-foreground' to='/privacy'>
                Privacy
              </Link>
              <Link className='hover:text-foreground' to='/terms'>
                Terms
              </Link>
              <Link className='hover:text-foreground' to='/cookies'>
                Cookies
              </Link>
              <Link className='hover:text-foreground' to='/sitemap'>
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
