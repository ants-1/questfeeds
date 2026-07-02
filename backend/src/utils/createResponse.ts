export const createResponse = (
  success: boolean,
  data: any = null,
  error: any = null,
) => {
  return {
    success,
    data,
    error: error?.message || error,
  };
};
