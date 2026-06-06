type OrdersByAccountType = {
  waiting: number;
  inTransit: number;
  delivered: number;
  canceled: number;
};

type FullStatistic = {
  totalWaitingOrders: any;
  totalTransitOrders: any;
  totalLivredOrders: any;
  totalCanceledOrders: any;
  totalAcceptedProviders: any;
  totalWaitingProviders: any;
  totalAcceptedTransporters: any;
  totalWaitingTransporters: any;
  totalComplaints: any;
  totalClosedComplaints: any;
  b2b?: OrdersByAccountType; // 👈 nouveau
  b2c?: OrdersByAccountType; // 👈 nouveau
  
};
// export type Statistic = FullStatistic;
export type Statistic = Partial<FullStatistic>;
