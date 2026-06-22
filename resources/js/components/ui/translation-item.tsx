import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TranslationItemProps {
  translationKey: string;
  value: string;
  onChange: (key: string, value: string) => void;
}

export function TranslationItem({ translationKey, value, onChange }: TranslationItemProps) {
  const isLongText = value.length > 100;

  return (
    <div className="grid grid-cols-5 gap-4 p-3 border-b hover:bg-muted/30">
      <div className="col-span-2 flex items-start pt-2">
        <code className="text-xs text-muted-foreground break-all">{translationKey}</code>
      </div>
      <div className="col-span-3">
        {isLongText ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(translationKey, e.target.value)}
            className="min-h-[80px] resize-none"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(translationKey, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}