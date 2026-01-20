import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useLanguage } from '@/i18n/useLanguage';

export function LanguageToggle() {
  const { current, languages, changeLanguage } = useLanguage();
  const currentLabel = current === 'vi' ? 'VI' : 'EN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <span className='font-medium'>{currentLabel}</span>
          <span className='sr-only'>Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((lng) => (
          <DropdownMenuItem
            key={lng.locale}
            onClick={() => changeLanguage(lng.locale)}
            className={current === lng.locale ? 'font-semibold' : undefined}
          >
            {lng.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
