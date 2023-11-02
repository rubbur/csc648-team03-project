const comparators = {
  Date: (a, b) => {
    if (a.date_created && b.date_created)
      return a.date_created - b.date_created;
    else return 0;
  },
  Price: (a, b) => {
    if (a.hourly_rate && b.hourly_rate) return +a.hourly_rate - +b.hourly_rate;
    else return 0;
  },
  Review: (a, b) => {
    if (a.avg_review && b.avg_review) return +a.avg_review - +b.avg_review;
    else return 0;
  },
  Alpha: (a, b) => {
    if (a.name && b.name) return a.name.localeCompare(b.name);
    else return 0;
  },
};

export default comparators;
