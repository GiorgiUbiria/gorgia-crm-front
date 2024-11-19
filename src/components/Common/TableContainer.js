import React, { Fragment } from "react";
import { Row, Table, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  currentPage,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
  onItemsPerPageChange,
  setCurrentPage,
}) => {

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / itemsPerPage),
  });

  const {
    getHeaderGroups,
    getRowModel,
  } = table;

  const navigate = useNavigate();

  // Handle page click
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle previous page click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPreviousPage();
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onNextPage();
    }
  };

  return (
    <Fragment>
      <div className={divClassName ? divClassName : "table-responsive "}>
        <Table hover className={tableClass}  bordered={isBordered}>
          <thead className={theadClass}>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan} className={`${header.column.columnDef.enableSorting ? "sorting sorting_desc" : ""}`}>
                    {header.isPlaceholder ? null : (
                      <div onClick={header.column.getToggleSortingHandler()} className={header.column.getCanSort() ? 'cursor-pointer' : ''}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map(row => (
              <tr key={row.id} onClick={() => navigate(`/comment/${row.original.id}`)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {isPagination && totalPages > 1 && (
        <Row className="justify-content-between align-items-center mt-3">
          <Col sm={12} md={5}>
            <div className="text-muted dataTables_info">
              ნაჩვენებია {currentPage}-ლი გვერდი {totalPages} გვერდიდან (სულ {totalItems}-ი ჩანაწერია)
            </div>
          </Col>
          <Col sm={12} md={7} className={paginationWrapper}>
            <ul className="pagination">
              <li className={`page-item ${currentPage <= 1 ? "disabled" : ''}`}>
                <Link className="page-link" to="#" onClick={handlePreviousPage}>
                  <i className="mdi mdi-chevron-left"></i>
                </Link>
              </li>
              {[...Array(totalPages).keys()].map((page) => (
                <li
                  key={page + 1}
                  className={`page-item ${currentPage === page + 1 ? "active" : ""}`}
                >
                  <Link
                    className="page-link"
                    to="#"
                    onClick={() => handlePageClick(page + 1)}
                  >
                    {page + 1}
                  </Link>
                </li>
              ))}
              <li className={`page-item ${currentPage >= totalPages ? "disabled" : ''}`}>
                <Link className="page-link" to="#" onClick={handleNextPage}>
                  <i className="mdi mdi-chevron-right"></i>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;
