"use client";

import dynamic from "next/dynamic";
import css from "./Pagination.module.css";

const ReactPaginate = dynamic(() => import("react-paginate"), {
  ssr: false,
});

type PageChangeEvent = {
  selected: number;
};

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (event: PageChangeEvent) => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
