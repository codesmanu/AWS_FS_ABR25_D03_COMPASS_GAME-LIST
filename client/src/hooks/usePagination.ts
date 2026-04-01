import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage: number;
}

interface UsePaginationResult {
    currentPage: number;
    totalPages: number;
    currentItems: any[];
    pageNumbers: (number | string)[];
    paginate: (pageNumber: number) => void;
    indexOfFirstItem: number;
    indexOfLastItem: number;
}

export const usePagination = <T>(
    items: T[],
    itemsPerPage: number,
): UsePaginationResult => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const generatePageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 2, currentPage + 1);

            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            }

            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages - 1;
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i > 1 && i < totalPages) {
                    pages.push(i);
                }
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1 && !pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        const uniquePages = Array.from(new Set(pages)).sort((a, b) => {
            if (typeof a === 'string' || typeof b === 'string') return 0;
            return (a as number) - (b as number);
        });

        const finalPageNumbers: (number | string)[] = [];
        for (let i = 0; i < uniquePages.length; i++) {
            if (
                uniquePages[i] === '...' &&
                finalPageNumbers[finalPageNumbers.length - 1] === '...'
            ) {
                continue;
            }
            finalPageNumbers.push(uniquePages[i]);
        }

        return finalPageNumbers;
    }, [currentPage, totalPages]);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        pageNumbers: generatePageNumbers,
        paginate,
        indexOfFirstItem,
        indexOfLastItem,
    };
};
