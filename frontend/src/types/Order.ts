export type Order = {
  id?: string;
  trackingNumber?: any; // to be removed the correct one is trackingId
  trackingId?: any;
  description?: string;
  totalLength?: number;
  totalWidth?: number;
  totalHeight?: number;
  totalWeight?: number;
  totalQuantity: number;
  totalPrice?: number | null | undefined;
  clientPrice?: number | null | undefined | any;
  clientPriceStatusId?: number | null | undefined | any;
  transporterPrice?: number | null | undefined | any;
  transporterPriceStatusId?: number | null | undefined | any;
  eta?: Date | null | undefined | any;
  etd?: Date | null | undefined | any;
  packages: Package[];
  pods?: any[];
  refrences: string[];
  deliveredBy?: any;
  shipmentPrice?: number;
  createdByUserId?: number | null;

  recipient: {
    id?: any;
    companyName: string;
    phone: string;
    city: string;
    country: string;
    streetAddress: string;
    secondAddress: string;
    zipCode: string;
    email?: string;
  };
  source: {
    id?: any;
    companyName: string;
    phone: string;
    city: string;
    country: string;
    streetAddress: string;
    secondAddress: string;
    zipCode: string;
    email?: string;
  };
  orderStatusId?: any;
  deliveredByUserId?: any;
  createdAt?: string;
  startTransitAt?: string;
  deliveredAt?: any;
};

export type Package = {
  id?: any;
  weight: number;
  length: number;
  width: number;
  height: number;
  price?: number;
  quantity: number;
  orderId?: any;
  updatedAt?: string;
  createdAt?: string;
  index?: number;
};
export type PackagesData = {
  packages: Package[];
  totalPrice?: number;
  totalWeight?: number;
  totalQuantity?: number;
};
export type OrderStatus = {
  id?: any;
  statusName: string;
};
export type OrderType = "deliverOrder" | "bringOrder";
