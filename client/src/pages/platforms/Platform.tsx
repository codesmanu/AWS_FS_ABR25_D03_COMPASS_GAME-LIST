import { useCallback, useState, useEffect } from 'react';
import { GET, POST, PATCH, DELETE } from '../../utils/apiClient';
import Modal, { type ModalMode } from '../../components/modals/Modal';
import { platformFields } from '../../utils/fieldConfig';
import './Platform.css';

import Remove from '../../components/remove/Remove';
import Button from '../../components/ui/Button/Button';
import Header from '../../components/header/Header';
import SideBar from '../../components/sidebar/SideBar';
import Table from '../../components/table/Table';
import { type PlatformTypes } from '../../types/Platform.types';
import { type ColumnDefinition, type ActionConfig } from '../../types/Table.types';
import { toast } from 'react-toastify';

import { IoEyeOutline } from 'react-icons/io5';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

const Platform: React.FC = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [isRemoveModalOpen, setisRemoveModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformTypes | null>(null);

    const [platformsData, setPlatformsData] = useState<PlatformTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<boolean>(false);

    const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);

    const loadPlatforms = useCallback(async () => {
        try {
            setLoading(true);
            const platforms = await GET<PlatformTypes[]>('/platform');
            setPlatformsData(platforms);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching platforms:', err);

            if (err.response?.status === 401) {
                setAuthError(true);
                setError(
                    'Authentication error. Please try refreshing the page or log in again.',
                );
            } else {
                setError('Failed to load platforms. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [authError]);

    useEffect(() => {
        loadPlatforms();
    }, [loadPlatforms]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedPlatform(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (platform: PlatformTypes) => {
        setModalMode('edit');
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (platform: PlatformTypes) => {
        setModalMode('view');
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenDeleteModal = (platform: PlatformTypes) => {
        setSelectedPlatform(platform);
        setisRemoveModalOpen(true);
    };

    const handleSubmitPlatform = useCallback(
        async (formData: Record<string, any>) => {
            try {
                setLoading(true);

                const cleanedData = { ...formData };

                if (
                    cleanedData.acquisitionYear === '' ||
                    cleanedData.acquisitionYear === null
                ) {
                    delete cleanedData.acquisitionYear;
                } else if (cleanedData.acquisitionYear) {
                    cleanedData.acquisitionYear = Number(cleanedData.acquisitionYear);
                }

                console.log('Sending platform data:', cleanedData);

                if (modalMode === 'add') {
                    const response = await POST<PlatformTypes>('/platform', cleanedData);
                    setPlatformsData((prevPlatforms) => [...prevPlatforms, response]);
                    toast.success(`Platform "${cleanedData.name}" added successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                    setIsModalOpen(false);
                } else if (modalMode === 'edit' && selectedPlatform) {
                    const response = await PATCH<PlatformTypes>(
                        `/platform/${selectedPlatform.id}`,
                        cleanedData,
                    );
                    setPlatformsData((prevPlatforms) =>
                        prevPlatforms.map((platform) =>
                            platform.id === selectedPlatform.id ? response : platform,
                        ),
                    );
                    toast.success(`Platform "${cleanedData.name}" updated successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                    setIsModalOpen(false);
                }

                setError(null);
            } catch (err: any) {
                console.error('Error saving platform:', err);
                console.error('Response status:', err.response?.status);
                console.error('Response data:', err.response?.data);

                if (err.response?.status === 401) {
                    setAuthError(true);
                    setError(
                        'Authentication error. Please try refreshing the page or log in again.',
                    );
                } else if (err.response?.status === 409) {
                    const errorMsg =
                        err.response?.data?.message ||
                        'A conflict occurred with this platform data.';
                    setError(errorMsg);
                    toast.error(errorMsg, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                } else {
                    setError(
                        `Failed to save platform: ${err.response?.data?.message || err.message}`,
                    );
                    toast.error('Failed to save platform. Please try again.', {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                }
            } finally {
                setLoading(false);
            }
        },
        [modalMode, selectedPlatform, authError],
    );

    const handleDeleteConfirm = async () => {
        if (selectedPlatform) {
            try {
                await DELETE(`/platform/${selectedPlatform.id}`);
                setPlatformsData((prevPlatforms) =>
                    prevPlatforms.filter((c) => c.id !== selectedPlatform.id),
                );
                toast.success(`Deleted platform: ${selectedPlatform.name}`, {
                    position: 'bottom-right',
                    theme: 'dark',
                });
            } catch (err: any) {
                console.error('Error deleting platform:', err);
                toast.error('Failed to delete platform. Please try again.', {
                    position: 'bottom-right',
                    theme: 'dark',
                });
            }
        }
    };

    const handleDeletePlatform = useCallback(async (platform: PlatformTypes) => {
        handleOpenDeleteModal(platform);
    }, []);

    const platformColumns: ColumnDefinition<
        PlatformTypes,
        keyof PlatformTypes
    >[] = [
            {
                id: 'imageUrl',
                header: '',
                accessor: (item) =>
                    item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : null,
                sortable: false,
                headerClassName: 'header-image-col',
                cellClassName: 'cell-image',
                width: '4rem',
            },
            {
                id: 'name',
                header: 'Name',
                accessor: 'name',
                sortable: true,
                sortKey: 'name',
                cellClassName: 'cell-title',
                width: '2fr',
            },
            {
                id: 'company',
                header: 'Company',
                accessor: 'company',
                sortable: true,
                sortKey: 'company',
                cellClassName: 'cell-description',
                width: '1fr',
            },
            {
                id: 'acquisitionYear',
                header: 'Acquisition Year',
                accessor: 'acquisitionYear',
                sortable: true,
                sortKey: 'acquisitionYear',
                cellClassName: 'cell-category',
                width: '1.5fr',
            },
            {
                id: 'createdAt',
                header: 'Created At',
                accessor: 'createdAt',
                sortable: true,
                sortKey: 'createdAt',
                cellClassName: 'cell-created-at',
                width: '1.5fr',
            },
            {
                id: 'updatedAt',
                header: 'Updated At',
                accessor: 'updatedAt',
                sortable: true,
                sortKey: 'updatedAt',
                cellClassName: 'cell-updated-at',
                width: '1.5fr',
            },
        ];

    const platformActions: ActionConfig<PlatformTypes>[] = [
        {
            icon: IoEyeOutline,
            onClick: handleOpenViewModal,
            tooltip: 'View Details',
        },
        { icon: LuPencil, onClick: handleOpenEditModal, tooltip: 'Edit Game' },
        {
            icon: LuTrash2,
            onClick: handleDeletePlatform,
            tooltip: 'Delete Platform',
        },
    ];

    if (loading) {
        return <div className="loading">Loading platforms...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <div id="platform">
                <SideBar isOpen={isSideBarOpen} />
                <div className="platform-content">
                    <Header onToggleSideBar={toggleSideBar}>Platforms</Header>
                    <div className="platform-page">
                        <Button className="new-platorm-button" onClick={handleOpenAddModal}>
                            NEW PLATFORM
                        </Button>

                        <Table<PlatformTypes, keyof PlatformTypes>
                            data={platformsData}
                            columns={platformColumns}
                            actions={platformActions}
                            onRowClick={(row) => console.log('Row clicked:', row)}
                            noItemsMessage="No platforms found, try adding one!"
                            initialSortBy="name"
                            initialSortDirection="asc"
                            itemsPerPage={10}
                        />
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={
                        modalMode === 'add'
                            ? 'Add New Platform'
                            : modalMode === 'edit'
                                ? 'Edit Platform'
                                : 'Platform Details'
                    }
                    fields={platformFields}
                    mode={modalMode}
                    initialValues={selectedPlatform || {}}
                    onSubmit={handleSubmitPlatform}
                    submitButtonText={
                        modalMode === 'add' ? 'Add Platform' : 'Save Changes'
                    }
                />

                <Remove
                    isOpen={isRemoveModalOpen}
                    onClose={() => setisRemoveModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={selectedPlatform?.name || 'Platform'}
                />
            </div>
        </>
    );
};

export default Platform;