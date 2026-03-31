import { useState, useMemo, useCallback, useEffect } from 'react';
import './Games.css';

import Header from '../../components/header/Header';
import SideBar from '../../components/sidebar/SideBar';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/table/Table';
import Modal, { type ModalMode } from '../../components/modals/Modal';
import { gameFields } from '../../utils/fieldConfig';
import type { ColumnDefinition, ActionConfig } from '../../types/Table.types';

import { type Game } from '../../types/Game.types';
import useGameFilters from '../../hooks/useGameFilters';
import { toast } from 'react-toastify';

import { IoSearchOutline, IoEyeOutline } from 'react-icons/io5';
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { GET, POST, PATCH, DELETE } from '../../utils/apiClient';

const Games: React.FC = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const toggleSideBar = useCallback(
        () => setIsSideBarOpen((prev) => !prev),
        [],
    );

    const [gamesData, setGamesData] = useState<Game[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const emptyGameData = useMemo(() => ({}), []);

    const loadGames = useCallback(async () => {
        try {
            setLoading(true);
            const response = await GET<Game[]>('/game');
            setGamesData(response);
            setError(null);
        } catch (err: any) {
            // console.error('Error fetching games:', err);

            if (err.response?.status === 401) {
                setAuthError(true);
                setError(
                    'Authentication error. Please try refreshing the page or log in again.',
                );
            } else {
                setError('Failed to load games. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [authError]);

    const loadCategories = useCallback(async () => {
        try {
            const response = await GET<any[]>('/category');
            setCategories(response);
        } catch (err: any) {
            // console.error('Error fetching categories:', err);
        }
    }, []);

    const loadPlatforms = useCallback(async () => {
        try {
            const response = await GET<any[]>('/platform');
            setPlatforms(response);
        } catch (err: any) {
            // console.error('Error fetching platforms:', err);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.allSettled([loadGames(), loadCategories(), loadPlatforms()]);
            setLoading(false);
        };
        init();
    }, [loadGames, loadCategories, loadPlatforms]);

    const dynamicGameFields = useMemo(() => {
        return gameFields.map((field) => {
            if (field.id === 'category') {
                return {
                    ...field,
                    options: categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    })),
                };
            }
            if (field.id === 'platform') {
                return {
                    ...field,
                    options: platforms.map((platform) => ({
                        value: platform.id,
                        label: platform.name,
                    })),
                };
            }
            return field;
        });
    }, [categories, platforms]);

    const {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedFilterFavorite,
        setSelectedFilterFavorite,
        filteredGames,
        handleClearFilters,
        handleSearch,
    } = useGameFilters(gamesData);

    const handleOpenAddModal = useCallback(() => {
        setModalMode('add');
        setSelectedGame(null);
        setIsModalOpen(true);
    }, []);

    const handleOpenViewModal = useCallback((game: Game) => {
        setModalMode('view');
        setSelectedGame(game);
        setIsModalOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((game: Game) => {
        setModalMode('edit');
        setSelectedGame(game);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleSubmitGame = useCallback(
        async (formData: Record<string, any>) => {
            try {
                setLoading(true);

                let statusValue;
                switch (formData.status?.toUpperCase()) {
                    case 'PLAYING':
                        statusValue = 'PLAYING';
                        break;
                    case 'COMPLETED':
                        statusValue = 'COMPLETED';
                        break;
                    case 'BACKLOG':
                        statusValue = 'BACKLOG';
                        break;
                    case 'ABANDONED':
                        statusValue = 'ABANDONED';
                        break;
                    default:
                        statusValue = 'BACKLOG';
                }

                const acquisitionDate = formData.acquisitionDate
                    ? new Date(formData.acquisitionDate)
                    : null;
                const finishDate = formData.finishDate
                    ? new Date(formData.finishDate)
                    : null;

                const gameData = {
                    title: formData.title,
                    description: formData.description || '',
                    imageUrl: formData.imageUrl || '',
                    status: statusValue,
                    acquisitionDate: acquisitionDate ? acquisitionDate.toISOString() : null,
                    finishDate: finishDate ? finishDate.toISOString() : null,
                    isFavorite: formData.isFavorite || false,
                    categoryId: formData.category,
                    platformId: formData.platform || null,
                };

                if (modalMode === 'add') {
                    const response = await POST<Game>('/game', gameData);
                    setGamesData((prev) => [...prev, response]);
                    toast.success(`Game "${formData.title}" added successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                } else if (modalMode === 'edit' && selectedGame) {
                    const response = await PATCH<Game>(`/game/${selectedGame.id}`, gameData);
                    setGamesData((prev) =>
                        prev.map((game) =>
                            game.id === selectedGame.id ? response : game,
                        ),
                    );
                    toast.success(`Game "${formData.title}" updated successfully!`, {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                }

                setIsModalOpen(false);
                setError(null);
            } catch (err: any) {
                // console.error('Error saving game:', err);

                if (err.response?.status === 401) {
                    setAuthError(true);
                    setError(
                        'Authentication error. Please try refreshing the page or log in again.',
                    );
                } else {
                    setError('Failed to save game. Please try again.');
                    toast.error('Failed to save game. Please try again.', {
                        position: 'bottom-right',
                        theme: 'dark',
                    });
                }
            } finally {
                setLoading(false);
            }
        },
        [modalMode, selectedGame, authError],
    );

    const handleDeleteGame = useCallback(async (game: Game) => {
        try {
            await DELETE(`/game/${game.id}`);
            setGamesData((prev) => prev.filter((g) => g.id !== game.id));
            toast.success(`Deleted game: ${game.title}`, {
                position: 'bottom-right',
                theme: 'dark',
            });
        } catch (err: any) {
            // console.error('Error deleting game:', err);
            toast.error('Failed to delete game. Please try again.', {
                position: 'bottom-right',
                theme: 'dark',
            });
        }
    }, []);

    const toggleFavoriteGame = useCallback(async (gameToToggle: Game) => {
        try {
            const updatedData = {
                isFavorite: !gameToToggle.isFavorite,
            };

            const response = await PATCH<Game>(`/game/${gameToToggle.id}`, updatedData);

            setGamesData((prevGames) =>
                prevGames.map((game) =>
                    game.id === gameToToggle.id ? response : game,
                ),
            );
        } catch (err: any) {
            // console.error('Error updating favorite status:', err);
            toast.error('Failed to update favorite status. Please try again.', {
                position: 'bottom-right',
                theme: 'dark',
            });
        }
    }, []);


    const allCategories = useMemo(() => {
        return categories.map((category) => category.name);
    }, [categories]);

    const gameColumns: ColumnDefinition<Game, keyof Game>[] = useMemo(
        () => [
            {
                id: 'imageUrl',
                header: '',
                accessor: (item) =>
                    item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : null,
                sortable: false,
                headerClassName: 'header-image-col',
                cellClassName: 'cell-image',
                width: '4rem',
            },
            {
                id: 'title',
                header: 'Title',
                accessor: 'title',
                sortable: true,
                sortKey: 'title',
                cellClassName: 'cell-title',
                width: '2fr',
            },
            {
                id: 'description',
                header: 'Description',
                accessor: 'description',
                sortable: true,
                sortKey: 'description',
                cellClassName: 'cell-description',
                width: '2fr',
            },
            {
                id: 'category',
                header: 'Category',
                accessor: (item) => {
                    return typeof item.category === 'object'
                        ? item.category.name
                        : item.category;
                },
                sortable: true,
                sortKey: 'category',
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
            {
                id: 'isFavorite',
                header: 'Favorite',
                accessor: (item: Game) => {
                    const IconComponent = item.isFavorite ? IoMdStar : IoMdStarOutline;
                    return (
                        <IconComponent
                            className={`action-icon favorite-icon ${item.isFavorite ? 'favorited' : ''}`}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleFavoriteGame(item);
                            }}
                            title={item.isFavorite ? 'Unfavorite' : 'Favorite'}
                        />
                    );
                },
                sortable: true,
                sortKey: 'isFavorite',
                cellClassName: 'cell-favorite-status',
                width: '1fr',
            },
        ],
        [toggleFavoriteGame],
    );

    const gameActions: ActionConfig<Game>[] = useMemo(
        () => [
            {
                icon: IoEyeOutline,
                onClick: handleOpenViewModal,
                tooltip: 'View Details',
            },
            { icon: LuPencil, onClick: handleOpenEditModal, tooltip: 'Edit Game' },
            { icon: LuTrash2, onClick: handleDeleteGame, tooltip: 'Delete Game' },
        ],
        [handleOpenViewModal, handleOpenEditModal, handleDeleteGame],
    );

    if (loading) {
        return <div className="loading">Loading games...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <div id="games">
                <SideBar isOpen={isSideBarOpen} />
                <div className="content">
                    <Header onToggleSideBar={toggleSideBar}>Games</Header>
                    <div id="games-page">
                        <Button className="newgame-button" onClick={handleOpenAddModal}>
                            NEW GAME
                        </Button>
                        <div className="filters">
                            <span>Filters</span>
                            <input
                                type="text"
                                placeholder="Search Game"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                <option value="all">All Categories</option>
                                {allCategories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="filter-favorite"
                                value={selectedFilterFavorite}
                                onChange={(e) => setSelectedFilterFavorite(e.target.value)}
                            >
                                <option value="" disabled>
                                    Filter Favorite
                                </option>
                                <option value="all">All</option>
                                <option value="favorited">Favorited</option>
                                <option value="no-favorited">Not Favorited</option>
                            </select>
                            <div className="filter-buttons">
                                <Button className="clear-button" onClick={handleClearFilters}>
                                    Clear
                                </Button>
                                <Button className="search-button" onClick={handleSearch}>
                                    Search <IoSearchOutline />
                                </Button>
                            </div>
                        </div>
                        <Table<Game, keyof Game>
                            data={filteredGames}
                            columns={gameColumns}
                            actions={gameActions}
                            onRowClick={handleOpenViewModal}
                            noItemsMessage="Nenhum jogo encontrado com os filtros aplicados."
                            initialSortBy="title"
                            initialSortDirection="asc"
                        />
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={
                        modalMode === 'add'
                            ? 'Add New Game'
                            : modalMode === 'edit'
                                ? 'Edit Game'
                                : 'Game Details'
                    }
                    fields={dynamicGameFields}
                    mode={modalMode}
                    initialValues={selectedGame || emptyGameData}
                    onSubmit={handleSubmitGame}
                    submitButtonText={modalMode === 'add' ? 'Add Game' : 'Save Changes'}
                />
            </div>
        </>
    );
};

export default Games;
