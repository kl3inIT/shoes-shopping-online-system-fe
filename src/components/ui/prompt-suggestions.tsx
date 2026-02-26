interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className='space-y-3 px-3 pt-3 sm:px-4 sm:pt-4'>
      <h2 className='text-sm font-semibold text-muted-foreground'>{label}</h2>
      <div className='flex flex-wrap gap-3 text-sm'>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: 'user', content: suggestion })}
            className='h-max rounded-2xl border bg-muted/40 px-3 py-2 text-left shadow-sm transition-all hover:bg-muted hover:shadow-md'
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
