exports.getYearFromTimestamp = (timestamp)=>{
    const date = new Date(timestamp);
    return date.getFullYear();
  }