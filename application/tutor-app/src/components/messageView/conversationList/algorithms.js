const comparators = {
  Alpha: (a, b) => {
    if (a.otherPersonUsername && b.otherPersonUsername)
      //TODO: make each convo have a name that is
      return a.otherPersonUsername.localeCompare(b.otherPersonUsername);
    else return 0;
  },
  Date: (a, b) => {
    //TODO: make every conversation card have a date stamp that is the same as the
    //last message sent in the conversation
    return a.date_stamp - b.date_stamp;
  },
};

export default comparators;
