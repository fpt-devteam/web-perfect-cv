export const formatDate = (dateString: string) => {
  if (!dateString) return 'Present';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const formatCompanyName = (companyName: string | null | undefined) => {
  if (!companyName) return '';
  return companyName.charAt(0).toUpperCase() + companyName.slice(1).toLowerCase();
};
