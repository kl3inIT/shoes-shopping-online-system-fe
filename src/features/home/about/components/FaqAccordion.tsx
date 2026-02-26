import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenId?: string;
}

export function FaqAccordion({ items, defaultOpenId }: FaqAccordionProps) {
  if (items.length === 0) {
    return (
      <p className='text-center text-muted-foreground'>
        No FAQs available at the moment.
      </p>
    );
  }

  return (
    <Accordion
      type='single'
      collapsible
      defaultValue={defaultOpenId}
      className='w-full'
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className='text-left'>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className='text-muted-foreground'>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default FaqAccordion;
