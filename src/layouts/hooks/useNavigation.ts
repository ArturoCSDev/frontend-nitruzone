import { useLocation } from 'react-router-dom';
import { ADMIN_NAVIGATION } from '../constants/navigation.constants';

export const useNavigation = () => {
  const location = useLocation();

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const getActiveGroup = () => {
    for (const group of ADMIN_NAVIGATION) {
      for (const item of group.items) {
        if (isActive(item.url)) {
          return group.title;
        }
      }
    }
    return null;
  };

  const getCurrentPageTitle = () => {
    for (const group of ADMIN_NAVIGATION) {
      for (const item of group.items) {
        if (isActive(item.url)) {
          return item.title;
        }
      }
    }
    return 'Panel Administrativo';
  };

  return {
    navigationGroups: ADMIN_NAVIGATION,
    isActive,
    getActiveGroup,
    getCurrentPageTitle,
    currentPath: location.pathname,
  };
};
