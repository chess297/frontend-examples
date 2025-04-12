/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type CreateTaskRequest = object;

export interface FindTaskResponse {
  records: string[];
  total: number;
  message: string;
}

export type UpdateTaskRequest = object;

export interface ApiErrRes {
  /** 状态码 */
  code: number;
  /** 状态信息 */
  message: string;
  /** 错误详细 */
  err: string;
}

export interface ApiOkRes {
  /**
   * 状态码
   * @default 200
   */
  code: number;
  /**
   * 状态信息
   * @default "成功"
   */
  message: string;
  /** 数据 */
  data: object;
}

export interface SignupResponse {
  id: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
}

export interface SigninRequest {
  name: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface RemoveUserRequest {
  /** 需要删除的用户id */
  id: string;
  /** 批量删除的用户id列表 */
  ids: string[];
}

export interface UpdateProfileRequest {
  userId?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title NestJS Example
 * @version 1.0
 * @contact
 *
 * The NestJS Example API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags app
     * @name AppControllerPingV1
     * @summary ping
     * @request GET:/api/v1/ping
     */
    appControllerPingV1: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/ping`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerCreateV1
     * @request POST:/api/v1/task
     */
    taskControllerCreateV1: (
      data: CreateTaskRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/task`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerFindAllV1
     * @request GET:/api/v1/task
     */
    taskControllerFindAllV1: (params: RequestParams = {}) =>
      this.request<FindTaskResponse, any>({
        path: `/api/v1/task`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerFindOneV1
     * @request GET:/api/v1/task/{id}
     */
    taskControllerFindOneV1: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/task/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerUpdateV1
     * @request PATCH:/api/v1/task/{id}
     */
    taskControllerUpdateV1: (
      id: string,
      data: UpdateTaskRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/task/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerRemoveV1
     * @request DELETE:/api/v1/task/{id}
     */
    taskControllerRemoveV1: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/task/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignupV1
     * @summary 注册
     * @request POST:/api/v1/auth/signup
     */
    authControllerSignupV1: (data: SignupRequest, params: RequestParams = {}) =>
      this.request<
        ApiOkRes & {
          /** @default null */
          data?: SignupResponse;
        },
        ApiErrRes & {
          /** @default 400 */
          code?: any;
          /** @default "请求错误" */
          message?: any;
          /** @default null */
          err?: any;
        }
      >({
        path: `/api/v1/auth/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSigninV1
     * @summary 登录
     * @request POST:/api/v1/auth/signin
     */
    authControllerSigninV1: (data: SigninRequest, params: RequestParams = {}) =>
      this.request<
        ApiOkRes & {
          /** @default null */
          data?: SigninResponse;
        },
        ApiErrRes & {
          /** @default 400 */
          code?: any;
          /** @default "请求错误" */
          message?: any;
          /** @default null */
          err?: any;
        }
      >({
        path: `/api/v1/auth/signin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignoutV1
     * @summary 登出
     * @request POST:/api/v1/auth/signout
     */
    authControllerSignoutV1: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/signout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerCreateV1
     * @summary 创建一个用户
     * @request POST:/api/v1/user
     */
    userControllerCreateV1: (
      data: CreateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/user`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindAllV1
     * @summary 查询用户
     * @request GET:/api/v1/user
     */
    userControllerFindAllV1: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/user`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerRemoveV1
     * @summary 删除用户
     * @request DELETE:/api/v1/user
     */
    userControllerRemoveV1: (
      data: RemoveUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/user`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name ProfileControllerFindOnnByUserIdV1
     * @summary 查询用户信息
     * @request GET:/api/v1/user/profile
     */
    profileControllerFindOnnByUserIdV1: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/user/profile`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name ProfileControllerUpdateV1
     * @summary 修改用户信息
     * @request PATCH:/api/v1/user/profile
     */
    profileControllerUpdateV1: (
      data: UpdateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/user/profile`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
