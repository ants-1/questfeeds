export const createReponse = (
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
