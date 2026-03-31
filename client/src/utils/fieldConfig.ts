import { type FieldConfig } from '../components/modals/Modal';

export const gameFields: FieldConfig[] = [
  {
    id: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter game title',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter game description',
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    required: false,
    options: [],
  },
  {
    id: 'platform',
    label: 'Platform',
    type: 'select',
    required: false,
    options: [],
  },
  {
    id: 'acquisitionDate',
    label: 'Acquisition Date',
    type: 'date',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'playing', label: 'Playing' },
      { value: 'completed', label: 'Completed' },
      { value: 'backlog', label: 'Backlog' },
    ],
  },
  {
    id: 'finishDate',
    label: 'Finish Date',
    type: 'date',
    dependsOn: {
      field: 'status',
      value: 'playing',
      condition: 'notEquals',
    },
  },
  {
    id: 'isFavorite',
    label: 'Mark as Favorite',
    type: 'checkbox',
  },
  {
    id: 'imageUrl',
    label: 'Game Image URL',
    type: 'imageSrc',
    placeholder: 'https://example.com/image.jpg',
  },
];

export const categoryFields: FieldConfig[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter category name',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter category description',
  },
];

export const platformFields: FieldConfig[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter platform name',
    required: true,
  },
  {
    id: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Enter company name',
    required: true,
  },
  {
    id: 'acquisitionYear',
    label: 'Acquisition Year',
    type: 'number',
    placeholder: 'YYYY',
  },
  {
    id: 'imageUrl',
    label: 'Platform Image URL',
    type: 'imageSrc',
    placeholder: 'https://example.com/image.jpg',
  },
];
