const comparators = {
  Date: (a, b) => {
    if (a.creation_date && b.creation_date) {
      let dateA = a.creation_date
        .replaceAll("-", "")
        .replaceAll(":", "")
        .replaceAll(" ", "");
      dateA = dateA.substring(0, dateA.length - 5).replace("T", "");
      let dateB = b.creation_date
        .replaceAll("-", "")
        .replaceAll(":", "")
        .replaceAll(" ", "");
      dateB = dateB.substring(0, dateB.length - 5).replace("T", "");
      return +dateA - +dateB;
    } else return 0;
  },
  Price: (a, b) => {
    if (a.hourly_rate && b.hourly_rate) return +a.hourly_rate - +b.hourly_rate;
    else return 0;
  },
  Review: (a, b) => {
    if (a.avg_rating !== undefined && b.avg_rating !== undefined) {
      return +a.avg_rating - +b.avg_rating;
    } else return 0;
  },
  Alpha: (a, b) => {
    if (a.name && b.name) return a.name.localeCompare(b.name);
    else return 0;
  },
};

export default comparators;
