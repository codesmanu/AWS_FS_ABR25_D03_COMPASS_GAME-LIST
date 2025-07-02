import { useCallback, useState, useEffect } from 'react';
import {
  fetchPlatforms,
  createPlatformApi,
  updatePlatformApi,
  deletePlatformApi,
  refreshToken,
} from '../../apiClient';
import Modal, { type ModalMode } from '../../components/Modals/Modal';
import { platformFields } from '../../utils/FieldConfig';
import './Platform.css';

import Remove from '../../components/Remove/Remove';
import Button from '../../components/ui/Button/Button';
import Header from '../../components/Header/Header';
import SideBar from '../../components/Sidebar/SideBar';
import Table from '../../components/Table/Table';
import { type PlatformTypes } from '../../types/Platform.types';
import {
  type ColumnDefinition,
  type ActionConfig,
} from '../../types/Table.types';
import { toast } from 'react-toastify';

import { IoEyeOutline } from 'react-icons/io5';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

// const platformExampleData = [
//   {
//     id: 1,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Nintendo Switch',
//     company: 'Nintendo',
//     acquisitionYear: '2020',
//     createdAt: '03/03/2017 00:00',
//     updatedAt: '15/05/2024 10:30',
//   },
//   {
//     id: 2,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Steam',
//     company: 'Valve Corporation',
//     acquisitionYear: '2015',
//     createdAt: '12/09/2003 00:00',
//     updatedAt: '01/06/2024 11:00',
//   },
//   {
//     id: 3,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'PlayStation 5',
//     company: 'Sony Interactive Entertainment',
//     acquisitionYear: '2021',
//     createdAt: '12/11/2020 00:00',
//     updatedAt: '28/05/2024 14:15',
//   },
//   {
//     id: 4,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Xbox Series X',
//     company: 'Microsoft',
//     acquisitionYear: '2022',
//     createdAt: '10/11/2020 00:00',
//     updatedAt: '27/05/2024 09:00',
//   },
//   {
//     id: 5,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'PC (Windows)',
//     company: 'Microsoft',
//     acquisitionYear: '2018',
//     createdAt: '20/11/1985 00:00',
//     updatedAt: '02/06/2024 16:45',
//   },
//   {
//     id: 6,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'GOG.com',
//     company: 'CD Projekt',
//     acquisitionYear: '2019',
//     createdAt: '01/09/2008 00:00',
//     updatedAt: '25/04/2024 13:20',
//   },
//   {
//     id: 7,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Epic Games Store',
//     company: 'Epic Games',
//     acquisitionYear: '2020',
//     createdAt: '06/12/2018 00:00',
//     updatedAt: '30/05/2024 17:00',
//   },
//   {
//     id: 8,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'PlayStation 4',
//     company: 'Sony Interactive Entertainment',
//     acquisitionYear: '2016',
//     createdAt: '15/11/2013 00:00',
//     updatedAt: '10/03/2024 08:50',
//   },
//   {
//     id: 9,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Xbox One',
//     company: 'Microsoft',
//     acquisitionYear: '2017',
//     createdAt: '22/11/2013 00:00',
//     updatedAt: '12/02/2024 11:05',
//   },
//   {
//     id: 10,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Nintendo 3DS',
//     company: 'Nintendo',
//     acquisitionYear: '2014',
//     createdAt: '26/02/2011 00:00',
//     updatedAt: '05/01/2024 10:10',
//   },
//   {
//     id: 11,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Google Play Store',
//     company: 'Google',
//     acquisitionYear: '2016',
//     createdAt: '22/10/2008 00:00',
//     updatedAt: '03/06/2024 09:30',
//   },
//   {
//     id: 12,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'App Store (iOS)',
//     company: 'Apple Inc.',
//     acquisitionYear: '2017',
//     createdAt: '10/07/2008 00:00',
//     updatedAt: '03/06/2024 09:35',
//   },
//   {
//     id: 13,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Oculus Quest 2 / Meta Quest 2',
//     company: 'Meta Platforms',
//     acquisitionYear: '2021',
//     createdAt: '13/10/2020 00:00',
//     updatedAt: '20/05/2024 18:00',
//   },
//   {
//     id: 14,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'GeForce Now',
//     company: 'NVIDIA',
//     acquisitionYear: '2023',
//     createdAt: '04/02/2020 00:00',
//     updatedAt: '15/05/2024 14:00',
//   },
//   {
//     id: 15,
//     imageUrl: 'https://placehold.co/600x400?text=Hello\nWorld',
//     title: 'Xbox Cloud Gaming (xCloud)',
//     company: 'Microsoft',
//     acquisitionYear: '2022',
//     createdAt: '15/09/2020 00:00',
//     updatedAt: '29/05/2024 11:20',
//   },
// ];

const Platform: React.FC = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [isRemoveModalOpen, setisRemoveModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformTypes | null>(null);

  const [platformsData, setPlatformsData] = useState<PlatformTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);

  const loadPlatforms = useCallback(async () => {
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

      const response = await fetchPlatforms();
      setPlatformsData(response.data);
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

        if (authError) {
          try {
            await refreshToken();
            setAuthError(false);
          } catch (refreshErr) {
            console.error('Token refresh failed before submit:', refreshErr);
          }
        }

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
          try {
            const response = await createPlatformApi(cleanedData);
            setPlatformsData((prevPlatforms) => [
              ...prevPlatforms,
              response.data,
            ]);
            console.log('Added new platform:', response.data);
            toast.success(
              `Platform "${cleanedData.name}" added successfully!`,
              {
                position: 'bottom-right',
                theme: 'dark',
              },
            );
            setIsModalOpen(false);
          } catch (err: any) {
            console.error('API Error:', err.response?.data || err.message);
            throw err;
          }
        } else if (modalMode === 'edit' && selectedPlatform) {
          try {
            const response = await updatePlatformApi(
              selectedPlatform.id.toString(),
              cleanedData,
            );
            setPlatformsData((prevPlatforms) =>
              prevPlatforms.map((platform) =>
                platform.id === selectedPlatform.id ? response.data : platform,
              ),
            );
            console.log('Updated platform:', response.data);
            toast.success(
              `Platform "${cleanedData.name}" updated successfully!`,
              {
                position: 'bottom-right',
                theme: 'dark',
              },
            );
            setIsModalOpen(false);
          } catch (err: any) {
            console.error('API Error:', err.response?.data || err.message);
            throw err;
          }
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
        await deletePlatformApi(selectedPlatform.id.toString());
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
