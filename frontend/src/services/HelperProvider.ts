const filterData = (data: any[], filter: string | null) => {
  const now = new Date();
  const currentDay = now.getDate();
  const startOfWeek = now.getDate() - now.getDay();
  const endOfWeek = startOfWeek + 6;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  switch (filter) {
    case "Tout":
    case null:
      return data;

    case "Aujourd'hui":
      return data.filter((item: any) => {
        const itemDate = new Date(item?.createdAt);
        return (
          itemDate.getDate() === currentDay &&
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });

    case "Cette semaine":
      return data.filter((item: any) => {
        const itemDate = new Date(item?.createdAt);
        const itemDayOfMonth = itemDate.getDate();
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear &&
          itemDayOfMonth >= startOfWeek &&
          itemDayOfMonth <= endOfWeek
        );
      });

    case "Ce mois-ci":
      return data.filter((item: any) => {
        const itemDate = new Date(item?.createdAt);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });

    case "Cette année":
      return data.filter((item: any) => {
        const itemDate = new Date(item?.createdAt);
        return itemDate.getFullYear() === currentYear;
      });

    default:
      return data;
  }
};

export default filterData;
