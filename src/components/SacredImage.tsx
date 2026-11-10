import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SacredImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  fallbackLabel?: string;
}

export const SacredImage: React.FC<SacredImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectClass = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#F3ECE1] via-[#EBE0D0] to-[#DECBB4] text-[#5B1818] p-4 text-center select-none overflow-hidden ${aspectClass} ${className}`}
      >
        <svg
          className="w-10 h-10 mb-2 text-[#C85A17]/70"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M32 10C26 20 18 24 18 33C18 40.732 24.268 47 32 47C39.732 47 46 40.732 46 33C46 24 38 20 32 10Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 36C18 36 23 41 26 47M52 36C46 36 41 41 38 47"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="33" r="4" fill="currentColor" />
        </svg>
        <span className="font-display text-sm font-semibold tracking-wide text-[#231715] line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

export const SacredMotifIcon: React.FC<{ motif: string; className?: string }> = ({
  motif,
  className = 'w-4 h-4 text-[#C85A17]',
}) => {
  switch (motif) {
    case 'tulsi':
    case 'mala':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="5" r="2" />
          <circle cx="17" cy="8" r="2" />
          <circle cx="19" cy="14" r="2" />
          <circle cx="15" cy="19" r="2" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="5" cy="14" r="2" />
          <circle cx="7" cy="8" r="2" />
        </svg>
      );
    case 'flute':
    case 'peacock':
    case 'krishna':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M3 17L19 5" strokeLinecap="round" />
          <circle cx="8" cy="13" r="1" fill="currentColor" />
          <circle cx="11" cy="11" r="1" fill="currentColor" />
          <circle cx="14" cy="9" r="1" fill="currentColor" />
          <path d="M17 4C19.5 3.5 21 5.5 19.5 8" strokeLinecap="round" />
        </svg>
      );
    case 'diya':
    case 'lotus':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 3C10 6 9 8 12 11C15 8 14 6 12 3Z" />
          <path d="M4 14H20C19 18.5 16 20 12 20C8 20 5 18.5 4 14Z" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};
