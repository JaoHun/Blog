import type { ImgHTMLAttributes } from 'react';

type PostImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & {
  alt: string;
};

export function PostImage({ alt, className, loading = 'lazy', ...props }: PostImageProps) {
  if (!alt.trim()) {
    throw new Error('PostImage requires descriptive alt text.');
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      className={['post-image', className].filter(Boolean).join(' ')}
      loading={loading}
    />
  );
}
