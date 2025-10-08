import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

/**
 * Custom hook for responsive breakpoints
 * Provides convenient boolean flags for different screen sizes
 * @returns {Object} Object containing responsive breakpoint flags
 * @property {boolean} isMobile - True if screen width is below 'sm' (600px)
 * @property {boolean} isTablet - True if screen width is between 'sm' and 'md'
 * @property {boolean} isDesktop - True if screen width is 'md' (900px) or above
 * @property {boolean} isLargeScreen - True if screen width is 'lg' (1200px) or above
 * @property {boolean} isXLargeScreen - True if screen width is 'xl' (1536px) or above
 * @example
 * const { isMobile, isDesktop } = useResponsive();
 * return (
 *   <Box sx={{ padding: isMobile ? 2 : 4 }}>
 *     {isMobile ? <MobileNav /> : <DesktopNav />}
 *   </Box>
 * );
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isXLargeScreen,
  };
};

export default useResponsive;
