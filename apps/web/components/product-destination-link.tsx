import type { ReactNode } from 'react';
import Link from 'next/link';

type ProductDestinationLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  dataProduct?: string;
};

export function ProductDestinationLink({
  href,
  children,
  className,
  dataProduct
}: ProductDestinationLinkProps) {
  const analyticsProps = dataProduct ? { 'data-product': dataProduct } : {};

  if (href.startsWith('/')) {
    return <Link href={href} className={className} {...analyticsProps}>{children}</Link>;
  }

  return <a href={href} className={className} {...analyticsProps}>{children}</a>;
}
