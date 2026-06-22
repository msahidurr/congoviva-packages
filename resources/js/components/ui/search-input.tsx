import { Search } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  onSearch, 
  placeholder,
  className = "w-80"
}: SearchInputProps) {
  const { t } = useTranslation();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || t('Search...')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`pl-10 ${className}`}
        />
      </div>
      <Button onClick={onSearch}>{t('Search')}</Button>
    </div>
  );
}