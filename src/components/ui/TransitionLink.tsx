'use client';

import { usePageTransition } from '@/context/TransitionContext';

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Drop-in replacement for Next.js <Link> that plays the GSAP page
 * transition curtain before navigating.
 */
export function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
