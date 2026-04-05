/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ResponseDto {
  data: object;
}

export interface StatisticsDTO {
  totalWaitingOrders: object;
  totalTransitOrders: object;
  totalLivredOrders: object;
  totalCanceledOrders: object;
  totalAcceptedProviders: object;
  totalWaitingProviders: object;
  totalAcceptedTransporters: object;
  totalWaitingTransporters: object;
}

export interface UserDispoDTO {
  goingTo: string;
  startDay: string;
  endDay: string;
  startAt: string;
  endAt: string;
  comment: string;
}

export interface UserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  roleId?: number;
  companyName?: string;
  city?: string;
  country?: string;
  address?: string;
  zipCode?: string;
  websiteUrl?: string;
  commercialRegister?: string;
  patent?: string;
  companyTypeId?: number;
  userPackId?: number;
  carNumber: string;
  carTypeId: number;
  carWidth: number;
  carHeight: number;
  carWeight: number;
  disponibility: UserDispoDTO;
  verified: boolean;
}

export interface AllProvidersDTO {
  data: object;
}

export interface PaginationDTO {
  page: number;
  limit: number;
}

export interface GetProviderInvoiceDto {
  id?: number;
  /**
   * @format date-time
   * @default "2025-04-25T09:52:18.459Z"
   */
  from?: string;
  /**
   * @format date-time
   * @default "2025-04-25T09:52:18.459Z"
   */
  to?: string;
  invoiceType?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: object;
  refreshToken: object;
  user: object;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ResetPasswordReqDto {
  email: string;
}

export interface ResetPasswordDto {
  newPassword: string;
  resetPasswordToken: string;
}

export interface OrderSourceDTO {
  companyName: string;
  phone: string;
  city: string;
  country: string;
  streetAddress: string;
  secondAddress: string;
  zipCode: string;
  email: string;
}

export interface OrderRecipientDTO {
  companyName: string;
  phone: string;
  city: string;
  country: string;
  streetAddress: string;
  secondAddress: string;
  zipCode: string;
  email: string;
}

export interface PackagesReferences {
  referenceName: string;
  quantity: number;
}

export interface CreateOrderPackagesDTO {
  weight: number;
  width: number;
  length: number;
  height: number;
  price: number;
  quantity: number;
  references: PackagesReferences[];
}

export interface CreateOrderDto {
  description: string;
  totalWeight: number;
  totalLength: number;
  totalWidth: number;
  totalHeight: number;
  totalPrice: number;
  clientPrice: number;
  transporterPrice: number;
  totalQuantity: number;
  shipmentPrice: number;
  refrences: string[];
  createdByUserId: number;
  deliveredByUserId: number;
  source: OrderSourceDTO;
  recipient: OrderRecipientDTO;
  packages: CreateOrderPackagesDTO[];
  pods: object | null;
}

export interface UpdateOrderSourceDTO {
  id: number;
  companyName: string;
  phone: string;
  city: string;
  country: string;
  streetAddress: string;
  secondAddress: string;
  zipCode: string;
  email: string;
}

export interface UpdateOrderRecipientDTO {
  id: number;
  companyName: string;
  phone: string;
  city: string;
  country: string;
  streetAddress: string;
  secondAddress: string;
  zipCode: string;
  email: string;
}

export interface UpdatePackagesReferences {
  id: number;
  referenceName: string;
  quantity: number;
}

export interface UpdateOrderPackagesDTO {
  id: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  price: number;
  quantity: number;
  references?: UpdatePackagesReferences[];
}

export interface OrderDtoResponse {
  description?: string;
  totalWeight?: number;
  totalLength?: number;
  totalWidth?: number;
  totalHeight?: number;
  totalPrice?: number;
  clientPrice?: number;
  transporterPrice?: number;
  totalQuantity?: number;
  shipmentPrice?: number;
  refrences?: string[];
  orderStatusId?: number;
  deliveredByUserId?: number;
  source?: UpdateOrderSourceDTO;
  recipient?: UpdateOrderRecipientDTO;
  packages?: UpdateOrderPackagesDTO[];
  pods?: object | null;
  id?: number;
  deliveredBy?: object;
}

export interface UpdateOrderDtoRes {
  description: string;
  totalWeight: number;
  totalLength: number;
  totalWidth: number;
  totalHeight: number;
  totalPrice: number;
  clientPrice: number;
  transporterPrice: number;
  totalQuantity: number;
  shipmentPrice: number;
  refrences: string[];
  orderStatusId: number;
  deliveredByUserId: number;
  source: UpdateOrderSourceDTO;
  recipient?: UpdateOrderRecipientDTO;
  packages?: UpdateOrderPackagesDTO[];
  pods?: object | null;
  id: number;
  deliveredBy: object;
}

export interface AllOrderDtoResponse {
  orders: UpdateOrderDtoRes[][];
  totalCount: number;
}

export interface UpdateOrderDto {
  description: string;
  totalWeight: number;
  totalLength: number;
  totalWidth: number;
  totalHeight: number;
  totalPrice: number;
  clientPrice: number;
  transporterPrice: number;
  totalQuantity: number;
  shipmentPrice: number;
  refrences: string[];
  orderStatusId: number;
  deliveredByUserId: number;
  source: UpdateOrderSourceDTO;
  recipient?: UpdateOrderRecipientDTO;
  packages?: UpdateOrderPackagesDTO[];
  pods?: object | null;
}

export interface UpdateOrderTransporterDto {
  deliveredByUserId: number;
}

export interface CreatePackageDto {
  weight: number;
  width: number;
  length: number;
  height: number;
  price: number;
  quantity: number;
  references: PackagesReferences[];
  orderId: string;
}

export interface PackagesResponseDTO {
  id?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  price?: number;
  quantity?: number;
  references?: UpdatePackagesReferences[];
}

export interface AllPackagesResponseDTO {
  packages: UpdateOrderPackagesDTO;
  totalCount: number;
}

export interface AllTransportersDTO {
  data: object;
}

export interface CreateGeneratePdfDto {
  orderId: string;
}

export interface CreateClaimMsgPhotosDto {
  url: string;
}

export interface CreateClaimMsgDto {
  messageContent: string;
  senderId: number;
  photos: CreateClaimMsgPhotosDto[];
}

export interface CreateClaimDto {
  subject: string;
  description: string;
  orderId: string;
  messages: CreateClaimMsgDto[];
}

export interface CreateRespDTO {
  data: CreateClaimDto[];
}

export interface AddClaimMsgDto {
  messageContent: string;
  claimId: number;
  senderId: number;
  photos: CreateClaimMsgPhotosDto[];
}

export interface UpdateClaimDto {
  statusId: number;
}

export interface AllCLaimsRespDTO {
  totalCount: number;
  claims: UpdateClaimDto[];
}

export interface ClaimRespDTO {
  data: UpdateClaimDto;
}

export interface UpdateRespDTO {
  data: UpdateClaimDto[];
}

export interface UploadPodResponseDto {
  /**
   * The filename of the uploaded POD
   * @example "POD-order-id-12345.jpg"
   */
  filename: string;
  /**
   * The MIME type of the uploaded file
   * @example "image/jpeg"
   */
  type: string;
  /**
   * The URL to access the uploaded POD file
   * @example "http://example.com/uploadedFiles/POD-order-id-12345.jpg"
   */
  podUrl: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title TUNLOG
 * @version 1.0
 * @contact
 *
 * Tunlog apis
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  upload = {
    /**
     * No description
     *
     * @name AppControllerUploadFile
     * @summary Upload an image
     * @request POST:/upload
     * @secure
     */
    appControllerUploadFile: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResponseDto, any>({
        path: `/upload`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  };
  files = {
    /**
     * No description
     *
     * @name AppControllerSeeUploadedFile
     * @summary Visualize uploaded file
     * @request GET:/files/{filepath}
     * @secure
     */
    appControllerSeeUploadedFile: (filepath: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/files/${filepath}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  companyTypes = {
    /**
     * No description
     *
     * @name AppControllerGetAllCompanyTypes
     * @request GET:/company-types
     */
    appControllerGetAllCompanyTypes: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/company-types`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  companyActivities = {
    /**
     * No description
     *
     * @name AppControllerGetAllCompanyActivities
     * @request GET:/company-activities
     */
    appControllerGetAllCompanyActivities: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/company-activities`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  carTypes = {
    /**
     * No description
     *
     * @name AppControllerGetAllCarTypes
     * @request GET:/car-types
     */
    appControllerGetAllCarTypes: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/car-types`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  orderStatusesList = {
    /**
     * No description
     *
     * @name AppControllerGetOrderStatuses
     * @request GET:/order-statuses-list
     */
    appControllerGetOrderStatuses: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/order-statuses-list`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  statistics = {
    /**
     * No description
     *
     * @name AppControllerGetStatistics
     * @request GET:/statistics
     * @secure
     */
    appControllerGetStatistics: (params: RequestParams = {}) =>
      this.request<StatisticsDTO, any>({
        path: `/statistics`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  article = {
    /**
     * No description
     *
     * @name ArticleControllerCreate
     * @request GET:/article
     */
    articleControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/article`,
        method: 'GET',
        ...params,
      }),
  };
  mail = {
    /**
     * No description
     *
     * @tags mail
     * @name MailControllerCreate
     * @request GET:/mail
     * @secure
     */
    mailControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/mail`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserControllerCreate
     * @request POST:/user
     * @secure
     */
    userControllerCreate: (data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindAll
     * @request GET:/user
     * @secure
     */
    userControllerFindAll: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindAllProviders
     * @request GET:/user/all-providers
     * @secure
     */
    userControllerFindAllProviders: (
      query?: {
        /** Page number for pagination */
        page?: string;
        /** Limit of items per page */
        limit?: string;
        /** Email filter */
        email?: string;
        /** Verification status filter */
        verified?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllProvidersDTO, any>({
        path: `/user/all-providers`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindOne
     * @request GET:/user/{id}
     * @secure
     */
    userControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerUpdate
     * @request PATCH:/user/{id}
     * @secure
     */
    userControllerUpdate: (id: string, data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerRemove
     * @request DELETE:/user/{id}
     * @secure
     */
    userControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindProviderOrders
     * @request GET:/user/provider-orders/{id}
     * @secure
     */
    userControllerFindProviderOrders: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/provider-orders/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindUserOrdersInvoices
     * @request POST:/user/user-orders-invoices/{id}
     * @secure
     */
    userControllerFindUserOrdersInvoices: (id: string, data: PaginationDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/user-orders-invoices/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerVerifieUser
     * @request PATCH:/user/verfieUser/{id}
     * @secure
     */
    userControllerVerifieUser: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/verfieUser/${id}`,
        method: 'PATCH',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerUpdateUserDisponibility
     * @request PATCH:/user/user-disponibility/{id}
     * @secure
     */
    userControllerUpdateUserDisponibility: (id: string, data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/user-disponibility/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerGetProvidersInvoice
     * @request POST:/user/generate-provider-invoice
     */
    userControllerGetProvidersInvoice: (data: GetProviderInvoiceDto, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/generate-provider-invoice`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    authControllerRegister: (data: UserDTO, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRefreshToken
     * @request POST:/auth/refresh-token
     * @secure
     */
    authControllerRefreshToken: (data: RefreshTokenDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/refresh-token`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRequestPasswordReset
     * @request POST:/auth/request-reset-password-email
     */
    authControllerRequestPasswordReset: (data: ResetPasswordReqDto, params: RequestParams = {}) =>
      this.request<ResetPasswordDto, any>({
        path: `/auth/request-reset-password-email`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerResetPassword
     * @request POST:/auth/reset-password
     */
    authControllerResetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<ResetPasswordDto, any>({
        path: `/auth/reset-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetAuthenticatedUser
     * @request GET:/auth/me
     * @secure
     */
    authControllerGetAuthenticatedUser: (params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  orders = {
    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerCreate
     * @request POST:/orders/create-order
     * @secure
     */
    ordersControllerCreate: (data: CreateOrderDto, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/create-order`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerFindAll
     * @request GET:/orders/all-orders
     * @secure
     */
    ordersControllerFindAll: (
      query: {
        page: string;
        limit: string;
        trackingId: string;
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllOrderDtoResponse, any>({
        path: `/orders/all-orders`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerFindOne
     * @request GET:/orders/order-details/{id}
     * @secure
     */
    ordersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/order-details/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerFindOrderStatus
     * @request GET:/orders/order-status-details/{id}
     */
    ordersControllerFindOrderStatus: (id: string, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/order-status-details/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerUpdate
     * @request PATCH:/orders/update-order/{id}
     * @secure
     */
    ordersControllerUpdate: (id: string, data: UpdateOrderDto, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/update-order/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerUpdateOrderTransporter
     * @request PATCH:/orders/update-order-transporter/{id}
     * @secure
     */
    ordersControllerUpdateOrderTransporter: (id: string, data: UpdateOrderTransporterDto, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/update-order-transporter/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerUpdateStatus
     * @request PATCH:/orders/update-order-status/{id}
     * @secure
     */
    ordersControllerUpdateStatus: (id: string, data: UpdateOrderDto, params: RequestParams = {}) =>
      this.request<OrderDtoResponse, any>({
        path: `/orders/update-order-status/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrdersControllerRemove
     * @request DELETE:/orders/delete-order/{id}
     * @secure
     */
    ordersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/orders/delete-order/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  packages = {
    /**
     * No description
     *
     * @tags orders_packages
     * @name PackagesControllerCreate
     * @request POST:/packages
     * @secure
     */
    packagesControllerCreate: (data: CreatePackageDto, params: RequestParams = {}) =>
      this.request<PackagesResponseDTO, any>({
        path: `/packages`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders_packages
     * @name PackagesControllerFindAll
     * @request GET:/packages
     * @secure
     */
    packagesControllerFindAll: (params: RequestParams = {}) =>
      this.request<AllPackagesResponseDTO, any>({
        path: `/packages`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders_packages
     * @name PackagesControllerFindOne
     * @request GET:/packages/{id}
     * @secure
     */
    packagesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<PackagesResponseDTO, any>({
        path: `/packages/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders_packages
     * @name PackagesControllerUpdate
     * @request PATCH:/packages/{id}
     * @secure
     */
    packagesControllerUpdate: (id: string, data: UpdateOrderPackagesDTO, params: RequestParams = {}) =>
      this.request<PackagesResponseDTO, any>({
        path: `/packages/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders_packages
     * @name PackagesControllerRemove
     * @request DELETE:/packages/{id}
     * @secure
     */
    packagesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/packages/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  transporters = {
    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerCreate
     * @request POST:/transporters
     * @secure
     */
    transportersControllerCreate: (data: UserDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/transporters`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerFindAll
     * @request GET:/transporters
     * @secure
     */
    transportersControllerFindAll: (
      query?: {
        /** Page number for pagination */
        page?: string;
        /** Limit of items per page */
        limit?: string;
        /** firstName filter */
        firstName?: string;
        /** Verification status filter */
        verified?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllTransportersDTO, any>({
        path: `/transporters`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerFindOne
     * @request GET:/transporters/{id}
     * @secure
     */
    transportersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/transporters/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerUpdate
     * @request PATCH:/transporters/{id}
     * @secure
     */
    transportersControllerUpdate: (id: string, data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/transporters/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerRemove
     * @request DELETE:/transporters/{id}
     * @secure
     */
    transportersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/transporters/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerFindTransporterOrders
     * @request POST:/transporters/transporter-orders/{id}
     * @secure
     */
    transportersControllerFindTransporterOrders: (
      id: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResponseDto, any>({
        path: `/transporters/transporter-orders/${id}`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerFindTransporterAcceptedOrders
     * @request POST:/transporters/transporter-accepted-orders/{id}
     * @secure
     */
    transportersControllerFindTransporterAcceptedOrders: (
      id: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResponseDto, any>({
        path: `/transporters/transporter-accepted-orders/${id}`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags transporter
     * @name TransportersControllerFindTransporterDeliveredOrders
     * @request GET:/transporters/transporter-delivered-orders/{id}
     * @secure
     */
    transportersControllerFindTransporterDeliveredOrders: (
      id: string,
      query: {
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResponseDto, any>({
        path: `/transporters/transporter-delivered-orders/${id}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  generatePdf = {
    /**
     * No description
     *
     * @tags generate-pdf
     * @name GeneratePdfControllerGetPdf
     * @request GET:/generate-pdf
     */
    generatePdfControllerGetPdf: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/generate-pdf`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags generate-pdf
     * @name GeneratePdfControllerGenerateEtiquette
     * @request POST:/generate-pdf/etiquette-commande
     */
    generatePdfControllerGenerateEtiquette: (data: CreateGeneratePdfDto, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/generate-pdf/etiquette-commande`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  claims = {
    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerCreate
     * @request POST:/claims
     * @secure
     */
    claimsControllerCreate: (data: CreateClaimDto, params: RequestParams = {}) =>
      this.request<CreateRespDTO, any>({
        path: `/claims`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerFindAll
     * @request GET:/claims
     * @secure
     */
    claimsControllerFindAll: (
      query: {
        page: string;
        limit: string;
        id: string;
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllCLaimsRespDTO, any>({
        path: `/claims`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerAddMessage
     * @request POST:/claims/add-message
     * @secure
     */
    claimsControllerAddMessage: (data: AddClaimMsgDto, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/claims/add-message`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerFindOne
     * @request GET:/claims/{id}
     * @secure
     */
    claimsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ClaimRespDTO, any>({
        path: `/claims/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerUpdate
     * @request PATCH:/claims/{id}
     * @secure
     */
    claimsControllerUpdate: (id: string, data: UpdateClaimDto, params: RequestParams = {}) =>
      this.request<UpdateRespDTO, any>({
        path: `/claims/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags claims
     * @name ClaimsControllerRemove
     * @request DELETE:/claims/{id}
     * @secure
     */
    claimsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/claims/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  uploadPod = {
    /**
     * No description
     *
     * @tags upload-pod
     * @name UploadPodControllerUploadFile
     * @summary Upload POD
     * @request POST:/upload-pod/upload-pod
     * @secure
     */
    uploadPodControllerUploadFile: (
      data: {
        order_id?: string;
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadPodResponseDto, any>({
        path: `/upload-pod/upload-pod`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload-pod
     * @name UploadPodControllerSeeUploadedFile
     * @summary Visualize uploaded file
     * @request GET:/upload-pod/download-pod/files/{filepath}
     */
    uploadPodControllerSeeUploadedFile: (filepath: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/upload-pod/download-pod/files/${filepath}`,
        method: 'GET',
        ...params,
      }),
  };
}
