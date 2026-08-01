import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContentSidebar } from '@/components/sidebar/ContentSidebar';

describe('ContentSidebar', () => {
  it('renders the Chinese author, note, stats, and latest posts', async () => {
    render(await ContentSidebar({ lang: 'zh' }));

    expect(screen.getByText('JaoHun')).toBeInTheDocument();
    expect(screen.getByText('鎱㈡參璁板綍锛屼繚鎸佹竻閱掋€俙')).toBeInTheDocument();
    expect(screen.getByText('鍐呭缁熻')).toBeInTheDocument();
    expect(screen.getByText('鏈€鏂版枃绔燻')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
    expect(screen.getByRole('link', { name: '鏋勫缓涓€涓交閲忛潤鎬佸崥瀹?MVP' })).toHaveAttribute(
      'href',
      '/posts/static-blog-mvp',
    );
  });

  it('renders nested contents passed to the sidebar', async () => {
    render(
      await ContentSidebar({
        lang: 'en',
        children: (
          <nav aria-label="Contents">
            <a href="#intro">Introduction</a>
          </nav>
        ),
      }),
    );

    expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveAttribute('href', '#intro');
  });
});
