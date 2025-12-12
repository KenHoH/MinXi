const updateReport = async (
  delta: boolean,
  postId: number,
  updateReportUser: (userId: number, data: { delta: number }) => Promise<any>
) => {
  await updateReportUser(postId, { delta: delta ? 1 : -1 });
};

export default updateReport;
