import { useState, useEffect } from 'react';
import { type Game } from '../types/Game.types';

interface UseGameFiltersReturn {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedFilterFavorite: string;
  setSelectedFilterFavorite: React.Dispatch<React.SetStateAction<string>>;
  filteredGames: Game[];
  handleClearFilters: () => void;
  handleSearch: () => void;
}

const useGameFilters = (allGames: Game[]): UseGameFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilterFavorite, setSelectedFilterFavorite] = useState('');

  const [filteredGames, setFilteredGames] = useState<Game[]>(allGames);

  useEffect(() => {
    setFilteredGames(allGames);
  }, [allGames]);

  const handleSearch = () => {
    let currentFilteredGames = [...allGames];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      currentFilteredGames = currentFilteredGames.filter(
        (game) =>
          game.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (game.description?.toLowerCase() || '').includes(lowerCaseSearchTerm),
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      currentFilteredGames = currentFilteredGames.filter((game) => {
        // Verificar se category é um objeto ou string
        if (typeof game.category === 'object' && game.category) {
          return game.category.name === selectedCategory;
        } else {
          return game.category === selectedCategory;
        }
      });
    }

    if (selectedFilterFavorite && selectedFilterFavorite !== 'all') {
      if (selectedFilterFavorite === 'favorited') {
        currentFilteredGames = currentFilteredGames.filter(
          (game) => game.isFavorite,
        );
      } else if (selectedFilterFavorite === 'no-favorited') {
        currentFilteredGames = currentFilteredGames.filter(
          (game) => !game.isFavorite,
        );
      }
    }

    setFilteredGames(currentFilteredGames);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedFilterFavorite('');
    setFilteredGames(allGames);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedFilterFavorite,
    setSelectedFilterFavorite,
    filteredGames,
    handleClearFilters,
    handleSearch,
  };
};

export default useGameFilters;