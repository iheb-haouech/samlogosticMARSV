export type Complaint = {
  id?: any;
  subject: string;
  description?: string;
  statusId?: 1 | 2;
  orderId: any;
  creatorUserId?: any;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
  messages: message[];
  order: {
    id: any;
    trackingId: any;
  };
  creator: {
    id: 5;
    companyName: string;
    email: string;
  };
};

export type message = {
  id?: any;
  messageContent?: string;
  claimId?: any;
  senderId?: any;
  createdAt?: string;
  updatedAt?: string;
  photos?: any[];
  sender?: {
    id: any;
    firstName: string;
    lastName: string;
    email: string;
    roleId: 1 | 2 | 3 | 4;
  };
};
