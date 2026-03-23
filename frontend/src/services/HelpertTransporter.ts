const filterData = (data: any, filter: string) => {
  const now = new Date();
  const currentDay = now.getDate();
  const startOfWeek = now.getDate() - now.getDay();
  const lastDayOfWeek = startOfWeek + 6;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  switch (filter) {
    case "Tout":
      return data;

    case "Aujourd'hui":
      return data.filter((item: any) => new Date(item.creationDate).getDate() === currentDay);

    case "Cette semaine":
      return data.filter(
        (item: any) =>
          new Date(item.creationDate).getDate() >= startOfWeek + 1 &&
          lastDayOfWeek + 1 >= new Date(item.creationDate).getDate(),
      );

    case "Ce mois-ci":
      return data.filter((item: any) => new Date(item.creationDate).getMonth() === currentMonth);

    case "Cette année":
      return data.filter((item: any) => new Date(item.creationDate).getFullYear() === currentYear);

    default:
      return data;
  }
};

export default filterData;
