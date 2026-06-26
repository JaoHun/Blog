import Link from 'next/link';

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

export function Pagination({ basePath, currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="分页" className="mt-8 flex items-center justify-between text-sm">
      {currentPage > 1 ? (
        <Link className="text-link" href={pageHref(basePath, currentPage - 1)}>
          上一页
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted">
        第 {currentPage} / {totalPages} 页
      </span>
      {currentPage < totalPages ? (
        <Link className="text-link" href={pageHref(basePath, currentPage + 1)}>
          下一页
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
