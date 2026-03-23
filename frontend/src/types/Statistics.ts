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
  
};
// export type Statistic = FullStatistic;
export type Statistic = Partial<FullStatistic>;
