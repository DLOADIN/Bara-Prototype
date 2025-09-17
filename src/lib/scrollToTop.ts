/**
 * Utility function to scroll to the top of the page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Utility function to scroll to top immediately (without smooth behavior)
 */
export const scrollToTopImmediate = () => {
  window.scrollTo(0, 0);
};
