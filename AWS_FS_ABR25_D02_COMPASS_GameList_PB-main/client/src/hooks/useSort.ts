import { useState, useMemo, useCallback } from 'react';
import { type SortDirection } from '../types/Table.types';

interface UseSortReturn<T> {
  sortBy: keyof T | '';
  sortDirection: SortDirection;
  sortedItems: T[];
  handleSort: (column: keyof T) => void;
  clearSort: () => void;
}

function useSort<T>(
  items: T[],
  initialSortBy: keyof T | '' = '',
  initialSortDirection: SortDirection = '',
): UseSortReturn<T> {
  const [sortBy, setSortBy] = useState<keyof T | ''>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  const handleSort = useCallback(
    (column: keyof T) => {
      if (sortBy === column) {
        setSortDirection((prevDirection) =>
          prevDirection === 'asc'
            ? 'desc'
            : prevDirection === 'desc'
              ? ''
              : 'asc',
        );
      } else {
        setSortBy(column);
        setSortDirection('asc');
      }
    },
    [sortBy],
  );

  const clearSort = useCallback(() => {
    setSortBy('');
    setSortDirection('');
  }, []);

  const sortedItems = useMemo(() => {
    if (!sortBy || !sortDirection) {
      return [...items];
    }

    const sortableItems = [...items];

    sortableItems.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null || aValue === undefined)
        return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined)
        return sortDirection === 'asc' ? -1 : 1;

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        if (sortDirection === 'asc') {
          return aValue === bValue ? 0 : aValue ? 1 : -1;
        } else {
          return aValue === bValue ? 0 : aValue ? -1 : 1;
        }
      }

      if (
        (sortBy === 'createdAt' || sortBy === 'updatedAt') &&
        typeof aValue === 'string' &&
        typeof bValue === 'string'
      ) {
        const parseDate = (dateString: string) => {
          const [datePart, timePart] = dateString.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute] = timePart.split(':').map(Number);
          return new Date(year, month - 1, day, hour, minute);
        };
        const dateA = parseDate(aValue);
        const dateB = parseDate(bValue);

        if (sortDirection === 'asc') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sortableItems;
  }, [items, sortBy, sortDirection]);

  return {
    sortBy,
    sortDirection,
    sortedItems,
    handleSort,
    clearSort,
  };
}

export default useSort;
