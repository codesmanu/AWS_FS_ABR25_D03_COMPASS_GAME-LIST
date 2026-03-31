import { useState, useMemo, useCallback, useEffect } from 'react';
import { GET, POST, PATCH, DELETE } from '../../utils/apiClient';
import Modal, { type ModalMode } from '../../components/modals/Modal';
import { categoryFields } from '../../utils/fieldConfig';
import './Categories.css';

import Header from '../../components/header/Header';
import SideBar from '../../components/sidebar/SideBar';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/table/Table';
import type { ColumnDefinition, ActionConfig } from '../../types/Table.types';
import { type Category } from '../../types/Category.types';
import { toast } from 'react-toastify';

import { LuPencil, LuTrash2 } from 'react-icons/lu';
import Remove from '../../components/remove/Remove';

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

    const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await GET<Category[]>('/category');
            setCategoriesData(response);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching categories:', err);

            if (err.response?.status === 401) {
                setError(
                    'Authentication error. Please try refreshing the page or log in again.',
                );
            } else {
                setError('Failed to load categories. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

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

                if (modalMode === 'add') {
                    const response = await POST<Category>('/category', formData);
                    setCategoriesData((prevCategories) => [...prevCategories, response]);
                    toast.success(`Category "${response.name}" added successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                    setIsModalOpen(false);
                } else if (modalMode === 'edit' && selectedCategory) {
                    const response = await PATCH<Category>(
                        `/category/${selectedCategory.id}`,
                        formData,
                    );
                    setCategoriesData((prevCategories) =>
                        prevCategories.map((category) =>
                            category.id === selectedCategory.id ? response : category,
                        ),
                    );
                    toast.success(`Category "${response.name}" updated successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                    setIsModalOpen(false);
                }

                setError(null);
            } catch (err: any) {
                console.error('Error saving category:', err);

                if (err.response?.status === 401) {
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
        [modalMode, selectedCategory],
    );

    const handleDeleteConfirm = async () => {
        if (selectedCategory) {
            try {
                await DELETE(`/category/${selectedCategory.id}`);
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