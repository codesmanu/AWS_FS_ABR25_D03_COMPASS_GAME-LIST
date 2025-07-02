import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  refreshToken,
} from '../../apiClient';
import Modal, { type ModalMode } from '../../components/Modals/Modal';
import { categoryFields } from '../../utils/FieldConfig';
import './Categories.css';

import Header from '../../components/Header/Header';
import SideBar from '../../components/Sidebar/SideBar';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/Table/Table';
import type { ColumnDefinition, ActionConfig } from '../../types/Table.types';
import { type Category } from '../../types/Category.types';
import { toast } from 'react-toastify';

import { LuPencil, LuTrash2 } from 'react-icons/lu';
import Remove from '../../components/Remove/Remove';

// const categoriesExampleData: Category[] = [
//   {
//     id: 1,
//     name: 'Action',
//     description: 'Games focused on combat and quick reflexes.',
//     createdAt: '10/05/2023 08:00',
//     updatedAt: '15/05/2023 10:30',
//   },
//   {
//     id: 2,
//     name: 'Adventure',
//     description: 'Games with an emphasis on exploration and narrative.',
//     createdAt: '12/03/2023 14:15',
//     updatedAt: '20/03/2023 16:45',
//   },
//   {
//     id: 3,
//     name: 'RPG',
//     description: 'Role-playing games with character progression.',
//     createdAt: '01/02/2023 10:00',
//     updatedAt: '05/02/2023 11:20',
//   },
//   {
//     id: 4,
//     name: 'Strategy',
//     description: 'Games that require planning and tactical decision-making.',
//     createdAt: '20/01/2023 16:30',
//     updatedAt: '25/01/2023 09:00',
//   },
//   {
//     id: 5,
//     name: 'Simulation',
//     description: 'Games that replicate real-world or fictional activities.',
//     createdAt: '05/04/2023 11:00',
//     updatedAt: '10/04/2023 13:15',
//   },
// ];

const Categories: React.FC = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [isRemoveModalOpen, setisRemoveModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      if (authError) {
        try {
          await refreshToken();
          setAuthError(false);
        } catch (refreshErr) {
          console.error('Token refresh failed during load:', refreshErr);
        }
      }

      const response = await fetchCategories();
      setCategoriesData(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories:', err);

      if (err.response?.status === 401) {
        setAuthError(true);
        setError(
          'Authentication error. Please try refreshing the page or log in again.',
        );
      } else {
        setError('Failed to load categories. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [authError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setisRemoveModalOpen(true);
  };

  const handleSubmitCategory = useCallback(
    async (formData: Record<string, any>) => {
      try {
        setLoading(true);

        if (authError) {
          try {
            await refreshToken();
            setAuthError(false);
          } catch (refreshErr) {
            console.error('Token refresh failed before submit:', refreshErr);
          }
        }

        if (modalMode === 'add') {
          const response = await createCategoryApi(formData);
          setCategoriesData((prevCategories) => [
            ...prevCategories,
            response.data,
          ]);
          console.log('Added new category:', response.data);
          setIsModalOpen(false);
        } else if (modalMode === 'edit' && selectedCategory) {
          const response = await updateCategoryApi(
            selectedCategory.id.toString(),
            formData,
          );
          setCategoriesData((prevCategories) =>
            prevCategories.map((category) =>
              category.id === selectedCategory.id ? response.data : category,
            ),
          );
          console.log('Updated category:', response.data);
          setIsModalOpen(false);
        }

        setIsModalOpen(false);
        setError(null);
      } catch (err: any) {
        console.error('Error saving category:', err);

        if (err.response?.status === 401) {
          setAuthError(true);
          setError(
            'Authentication error. Please try refreshing the page or log in again.',
          );
        } else {
          setError('Failed to save category. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [modalMode, selectedCategory, authError],
  );

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      try {
        await deleteCategoryApi(selectedCategory.id.toString());
        setCategoriesData((prevCategories) =>
          prevCategories.filter((c) => c.id !== selectedCategory.id),
        );
        toast.success(`Deleted category: ${selectedCategory.name}`, {
          position: 'bottom-right',
          theme: 'dark',
        });
      } catch (err: any) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category. Please try again.', {
          position: 'bottom-right',
          theme: 'dark',
        });
      }
    }
  };

  const handleDeleteCategory = useCallback(async (category: Category) => {
    handleOpenDeleteModal(category);
  }, []);

  const categoryColumns: ColumnDefinition<Category, keyof Category>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        sortable: true,
        sortKey: 'name',
        cellClassName: 'cell-category-name',
        width: '1fr',
      },
      {
        id: 'description',
        header: 'Description',
        accessor: 'description',
        sortable: true,
        sortKey: 'description',
        cellClassName: 'cell-category-description',
        width: '2fr',
      },
      {
        id: 'createdAt',
        header: 'Created At',
        accessor: 'createdAt',
        sortable: true,
        sortKey: 'createdAt',
        cellClassName: 'cell-category-created-at',
        width: '1fr',
      },
      {
        id: 'updatedAt',
        header: 'Updated At',
        accessor: 'updatedAt',
        sortable: true,
        sortKey: 'updatedAt',
        cellClassName: 'cell-category-updated-at',
        width: '1fr',
      },
    ],
    [],
  );

  const categoryActions: ActionConfig<Category>[] = useMemo(
    () => [
      {
        icon: LuPencil,
        onClick: handleOpenEditModal,
        tooltip: 'Edit Category',
        className: 'action-edit',
      },
      {
        icon: LuTrash2,
        onClick: handleDeleteCategory,
        tooltip: 'Delete Category',
        className: 'action-delete',
      },
    ],
    [handleDeleteCategory],
  );

  return (
    <div id="categories">
      <SideBar isOpen={isSideBarOpen} />
      <div className="category-content">
        <Header onToggleSideBar={toggleSideBar}>Categories</Header>
        <div id="category-page">
          <Button className="newcategory-button" onClick={handleOpenAddModal}>
            NEW CATEGORY
          </Button>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-indicator">Loading...</div>}

          <Table<Category, keyof Category>
            data={categoriesData}
            columns={categoryColumns}
            actions={categoryActions}
            onRowClick={(category) =>
              console.log('Row clicked:', category.name)
            }
            noItemsMessage="Nenhuma categoria encontrada."
            initialSortBy="name"
            initialSortDirection="asc"
            itemsPerPage={15}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
        fields={categoryFields}
        mode={modalMode}
        initialValues={selectedCategory || {}}
        onSubmit={handleSubmitCategory}
        submitButtonText={modalMode === 'add' ? 'Add Category' : 'Save Changes'}
      />

      <Remove
        isOpen={isRemoveModalOpen}
        onClose={() => setisRemoveModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCategory?.name || 'Category'}
      />
    </div>
  );
};

export default Categories;
