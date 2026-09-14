import type { ReactNode } from 'react';

type TerminalArticleShellProps = {
  children: ReactNode;
};

export function TerminalArticleShell({ children }: TerminalArticleShellProps) {
  return <div className="terminal-home terminal-articles">{children}</div>;
}
