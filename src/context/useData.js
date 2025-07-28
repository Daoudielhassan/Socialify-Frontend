import { useContext } from 'react';
import DataContext from './DataContext';

// Hook personnalisé pour utiliser le contexte des données
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
};
