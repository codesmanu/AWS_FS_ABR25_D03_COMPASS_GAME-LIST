import React, { type ReactNode } from 'react';

export interface ColumnDefinition<T, K extends keyof T> {
    id: string;
    header: string | ReactNode | ((props: {}) => ReactNode);
    accessor?: keyof T | ((item: T) => ReactNode);
    sortable?: boolean;
    sortKey?: K;
    cellClassName?: string | ((item: T) => string);
    headerClassName?: string;
    width?: string;
}

export interface ActionConfig<T> {
    icon?: React.ComponentType<any>;
    getIcon?: (item: T) => React.ComponentType<any>;
    onClick: (item: T) => void;
    className?: string | ((item: T) => string);
    tooltip?: string | ((item: T) => string);
    isVisible?: (item: T) => boolean;
}

export type SortDirection = 'asc' | 'desc' | '';
