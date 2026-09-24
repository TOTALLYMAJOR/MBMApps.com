import Link from 'next/link';

const collections = [
  { id: 'apps', label: 'Apps', href: '/apps' },
  { id: 'tools', label: 'Tools', href: '/tools' },
  { id: 'work', label: 'Work', href: '/case-studies' },
  { id: 'articles', label: 'Articles', href: '/insights' },
  { id: 'approach', label: 'Approach', href: '/services' },
  { id: 'studio', label: 'Studio', href: '/about' },
  { id: 'contact', label: 'Contact', href: '/contact' }
] as const;

export type ContentCollection = (typeof collections)[number]['id'];

export function ContentDirectory({ current, context }: { current: ContentCollection; context: string }) {
  const position = collections.findIndex((collection) => collection.id === current) + 1;

  return (
    <nav className="content-directory" aria-label="MBMApps content collections">
      <div className="content-directory__context">
        <span>{String(position).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}</span>
        <strong>{context}</strong>
      </div>
      <div className="content-directory__links">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={collection.href}
            aria-current={collection.id === current ? 'page' : undefined}
          >
            {collection.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
