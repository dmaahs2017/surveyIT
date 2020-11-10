export const getSurveyStatusFromDates = (
  opensDateStr: Date,
  closesDateStr: Date
) => {
  const now = new Date();
  if (opensDateStr) {
    const opensDate = new Date(opensDateStr);
    if (closesDateStr) {
      const closesDate = new Date(closesDateStr);
      return opensDate < now && closesDate > now ? "Open" : "Closed";
    } else {
      return opensDate < now ? "Open" : "Closed";
    }
  } else {
    return "New";
  }
};
