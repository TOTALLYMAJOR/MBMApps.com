import Image from 'next/image';

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className = '', priority = false }: BrandMarkProps) {
  return (
    <span className={`mbm-brand-mark ${className}`.trim()} aria-hidden="true">
      <Image src="/mbmapps-mark.svg" alt="" width={1000} height={1000} priority={priority} />
    </span>
  );
}
