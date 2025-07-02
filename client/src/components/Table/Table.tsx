import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import './Table.css';
import Button from '../ui/Button/Button';

import { usePagination } from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';
import type {
  ColumnDefinition,
  ActionConfig,
  SortDirection,
} from '../../types/Table.types';

import { LiaSortDownSolid } from 'react-icons/lia';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface TableProps<T extends { id: number | string }, K extends keyof T> {
  data: readonly T[];
  columns: ColumnDefinition<T, K>[];
  actions?: ActionConfig<T>[];
  onRowClick?: (item: T) => void;
  noItemsMessage?: string;
  itemsPerPage?: number;
  initialSortBy?: K;
  initialSortDirection?: SortDirection;
}

const Table = <T extends { id: number | string }, K extends keyof T>({
  data,
  columns,
  actions,
  onRowClick,
  noItemsMessage = 'Nenhum item encontrado.',
  itemsPerPage = 10,
  initialSortBy,
  initialSortDirection,
}: TableProps<T, K>) => {
  const [currentTableData, setCurrentTableData] = useState<T[]>(() => [
    ...data,
  ]);

  useEffect(() => {
    setCurrentTableData([...data]);
  }, [data]);

  const { sortBy, sortDirection, sortedItems, handleSort } = useSort<T>(
    currentTableData,
    initialSortBy,
    initialSortDirection,
  );

  const { currentPage, totalPages, currentItems, pageNumbers, paginate } =
    usePagination<T>(sortedItems, itemsPerPage);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const handlePaginateAndScroll = (pageNumber: number) => {
    paginate(pageNumber);

    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const getSortIconDisplay = (columnSortKey?: K) => {
    if (!columnSortKey || sortBy !== columnSortKey || !sortDirection) {
      return <LiaSortDownSolid className="sort-by-icon sort-neutral" />;
    }
    if (sortDirection === 'asc') {
      return (
        <LiaSortDownSolid
          className="sort-by-icon sort-asc"
          style={{
            transition: 'all 0.2s ease-in-out',
            transform: 'rotate(180deg)',
          }}
        />
      );
    }
    return <LiaSortDownSolid className="sort-by-icon sort-desc" />;
  };

  const gridTemplateColumnsValue = useMemo(() => {
    const columnWidths = columns.map((col) => col.width || '1fr');
    if (actions && actions.length > 0) {
      columnWidths.push('5rem');
    }
    return columnWidths.join(' ');
  }, [columns, actions]);

  const dynamicGridStyle = {
    gridTemplateColumns: gridTemplateColumnsValue,
  };

  return (
    <div id="table-container">
      <hr className="horizontal-line" />
      <div className="table-parts">
        <div
          className="table-header table-grid-layout"
          style={dynamicGridStyle}
        >
          {columns.map((col) => (
            <div
              className={`header-cell ${col.headerClassName || ''}`}
              key={col.id}
              onClick={() =>
                col.sortable && col.sortKey && handleSort(col.sortKey)
              }
              style={{ cursor: col.sortable ? 'pointer' : 'default' }}
            >
              {typeof col.header === 'function' ? col.header({}) : col.header}
              {col.sortable && col.sortKey && (
                <Button className="sort-by-button button-styles">
                  {getSortIconDisplay(col.sortKey)}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="table-body" ref={tableBodyRef}>
          {currentItems.length === 0 ? (
            <div className="no-items-message">{noItemsMessage}</div>
          ) : (
            currentItems.map((item) => (
              <div
                className="table-row table-grid-layout"
                key={item.id}
                onClick={(e) => {
                  if (onRowClick) {
                    if (
                      e.target === e.currentTarget ||
                      (e.target as HTMLElement).parentElement ===
                        e.currentTarget
                    ) {
                      onRowClick(item);
                    }
                  }
                }}
                style={{
                  ...dynamicGridStyle,
                }}
              >
                {columns.map((col) => {
                  let cellContent: ReactNode;
                  if (typeof col.accessor === 'function') {
                    cellContent = col.accessor(item);
                  } else {
                    const val = item[col.accessor as keyof T];
                    cellContent =
                      val === null || val === undefined ? '' : String(val);
                  }
                  const cellDynamicClassName =
                    typeof col.cellClassName === 'function'
                      ? col.cellClassName(item)
                      : col.cellClassName;
                  return (
                    <div
                      className={`body-cell ${cellDynamicClassName || `cell-${col.id}`}`}
                      key={col.id}
                    >
                      <span>{cellContent}</span>
                    </div>
                  );
                })}
                {actions && actions.length > 0 && (
                  <div
                    className={`body-cell cell-actions ${columns[columns.length - 1]?.cellClassName || ''}`}
                  >
                    <div className="table-icons">
                      {actions.map((action, index) => {
                        if (action.isVisible && !action.isVisible(item)) {
                          return null;
                        }
                        let IconComponent: React.ComponentType<any> | undefined;
                        if (action.getIcon) {
                          IconComponent = action.getIcon(item);
                        } else if (action.icon) {
                          IconComponent = action.icon;
                        }
                        if (!IconComponent) {
                          return null;
                        }

                        const actionDynamicClassName =
                          typeof action.className === 'function'
                            ? action.className(item)
                            : action.className;
                        return (
                          <IconComponent
                            key={`${item.id}-action-${index}`}
                            className={`action-icon ${actionDynamicClassName || ''}`}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              action.onClick(item);
                            }}
                            title={action.tooltip}
                            size={20}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <div className="pagination">
          <Button
            onClick={() => handlePaginateAndScroll(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaArrowLeft />
            Previous
          </Button>
          {pageNumbers.map((page, index) => (
            <Button
              key={index}
              onClick={() => {
                if (typeof page === 'number') handlePaginateAndScroll(page);
              }}
              disabled={typeof page === 'string'}
              className={`pagination-button pagination-number ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </Button>
          ))}
          <Button
            onClick={() => handlePaginateAndScroll(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
            <FaArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Table;
