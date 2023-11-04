const comparators = {
  Date: (a, b) => {
    if (a.creation_date && b.creation_date)
      return a.creation_date - b.creation_date;
    else return 0;
  },
  Price: (a, b) => {
    if (a.hourly_rate && b.hourly_rate) return +a.hourly_rate - +b.hourly_rate;
    else return 0;
  },
  Review: (a, b) => {
    console.log(a.avg_rating, b.avg_rating);
    if (a.avg_rating !== undefined && b.avg_rating !== undefined) { return (+a.avg_rating) - (+b.avg_rating); }
    
    else return 0;
  },
  Alpha: (a, b) => {
    if (a.name && b.name) return a.name.localeCompare(b.name);
    else return 0;
  },
};

export default comparators;
