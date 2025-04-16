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

export interface SignupRequest {
  /** @example "user" */
  name: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "123456user" */
  password: string;
}

export interface SignupResponse {
  id: string;
}

export interface SigninRequest {
  /**
   * 邮箱
   * @example "user@example.com"
   */
  email: string;
  /**
   * 密码
   * @example "123456"
   */
  password: string;
}

export interface SigninResponse {
  success: boolean;
}

export interface UpdateProfileRequest {
  user_id?: string;
  phone?: string;
  country_code?: string;
  address?: string;
}

export interface CreateUserRequest {
  /** @example "user" */
  name: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "123456user" */
  password: string;
  /**
   * 用户角色id列表
   * @example "123456user"
   */
  roles: object[];
}

export type UserEntity = object;

export interface RemoveUserRequest {
  /** 需要删除的用户id */
  id: string;
  /** 批量删除的用户id列表 */
  ids: string[];
}

export interface CreateRoleRequest {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description: string;
  /** 权限ID列表 */
  permissions: string[];
  /** 用户ID列表 */
  users: string[];
}

export interface UpdateRoleDto {
  /** 角色名称 */
  name?: string;
  /** 角色描述 */
  description?: string;
  /** 权限ID列表 */
  permissions?: string[];
  /** 用户ID列表 */
  users?: string[];
}

/** 权限动作 */
export enum PermissionAction {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export interface CreatePermissionDto {
  name: string;
  description: string;
  /** 权限动作 */
  actions: PermissionAction[];
  resource: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  /** 权限动作 */
  actions?: PermissionAction[];
  resource?: string;
  /** 角色ID数组 */
  roles: string[];
}

export interface CreateMenuRequest {
  id: string;
  /** 菜单名称 */
  name: string;
  /** 菜单路径 */
  path: string;
  /** 菜单图标 */
  icon: string;
  /** 组件 */
  component: string;
  /** 父级菜单ID */
  parent_id: string;
}

export interface MenuEntity {
  id: string;
  name: string;
  path: string;
  icon: string;
  component: string;
}

export interface FindManyMenuResponse {
  records: MenuEntity[];
  total: number;
}

export interface UpdateMenuDto {
  id?: string;
  /** 菜单名称 */
  name?: string;
  /** 菜单路径 */
  path?: string;
  /** 菜单图标 */
  icon?: string;
  /** 组件 */
  component?: string;
  /** 父级菜单ID */
  parent_id?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  completed: boolean;
  /** 创建者 */
  creator: string;
}

export interface TaskModel {
  title: string;
  description: string;
  completed: boolean;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  id: string;
}

export interface FindTaskResponse {
  /** 任务列表 */
  records: TaskModel[];
  total: number;
  message: string;
}

export type UpdateTaskRequest = object;

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
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags app
   * @name AppControllerPingV1
   * @summary ping
   * @request GET:/api/v1/ping
   */
  appControllerPingV1 = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/ping`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags auth
   * @name Signup
   * @summary 注册
   * @request POST:/api/v1/auth/signup
   */
  signup = (data: SignupRequest, params: RequestParams = {}) =>
    this.http.request<SignupResponse, any>({
      path: `/api/v1/auth/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags auth
   * @name Signin
   * @summary 登录
   * @request POST:/api/v1/auth/signin
   */
  signin = (data: SigninRequest, params: RequestParams = {}) =>
    this.http.request<SigninResponse, any>({
      path: `/api/v1/auth/signin`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags auth
   * @name Signout
   * @summary 登出
   * @request POST:/api/v1/auth/signout
   */
  signout = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/auth/signout`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags auth
   * @name Logout
   * @summary 注销用户
   * @request POST:/api/v1/auth/logout
   */
  logout = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/auth/logout`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name ProfileControllerFindOnnByUserIdV1
   * @summary 获取当前用户的信息
   * @request GET:/api/v1/user/profile
   */
  profileControllerFindOnnByUserIdV1 = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/user/profile`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name ProfileControllerUpdateV1
   * @summary 修改当前用户信息
   * @request PATCH:/api/v1/user/profile
   */
  profileControllerUpdateV1 = (
    data: UpdateProfileRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/user/profile`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name ProfileControllerFindOneV1
   * @summary 获取路径id用户信息
   * @request GET:/api/v1/user/profile/{id}
   */
  profileControllerFindOneV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/user/profile/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name ProfileControllerUpdateOneV1
   * @summary 修改路径id用户信息
   * @request PATCH:/api/v1/user/profile/{id}
   */
  profileControllerUpdateOneV1 = (
    id: string,
    data: UpdateProfileRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/user/profile/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UserControllerCreateV1
   * @summary 创建新用户
   * @request POST:/api/v1/user
   */
  userControllerCreateV1 = (
    data: CreateUserRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/user`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UserControllerFindAllV1
   * @summary 查询多个用户
   * @request GET:/api/v1/user
   */
  userControllerFindAllV1 = (params: RequestParams = {}) =>
    this.http.request<UserEntity[], any>({
      path: `/api/v1/user`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UserControllerFindOnV1
   * @summary 查询单个用户
   * @request GET:/api/v1/user/{id}
   */
  userControllerFindOnV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<UserEntity[], any>({
      path: `/api/v1/user/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UserControllerRemoveV1
   * @summary 删除单个或多个用户
   * @request DELETE:/api/v1/user/{id}
   */
  userControllerRemoveV1 = (
    id: string,
    data: RemoveUserRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/user/${id}`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags role
   * @name RoleControllerCreateV1
   * @summary 创建角色
   * @request POST:/api/v1/role
   */
  roleControllerCreateV1 = (
    data: CreateRoleRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/role`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags role
   * @name RoleControllerFindAllV1
   * @summary 查询所有角色
   * @request GET:/api/v1/role
   */
  roleControllerFindAllV1 = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/role`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags role
   * @name RoleControllerFindOneV1
   * @summary 根据id查询角色
   * @request GET:/api/v1/role/{id}
   */
  roleControllerFindOneV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/role/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags role
   * @name RoleControllerUpdateV1
   * @summary 修改角色
   * @request PATCH:/api/v1/role/{id}
   */
  roleControllerUpdateV1 = (
    id: string,
    data: UpdateRoleDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/role/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags role
   * @name RoleControllerRemoveV1
   * @summary 删除角色
   * @request DELETE:/api/v1/role/{id}
   */
  roleControllerRemoveV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/role/${id}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description 创建权限
   *
   * @tags permission
   * @name CreatePermission
   * @summary 创建权限
   * @request POST:/api/v1/permission
   */
  createPermission = (data: CreatePermissionDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/permission`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 查询所有权限
   *
   * @tags permission
   * @name FindManyPermission
   * @summary 查询所有权限
   * @request GET:/api/v1/permission
   */
  findManyPermission = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/permission`,
      method: "GET",
      ...params,
    });

  /**
   * @description 根据id查询权限
   *
   * @tags permission
   * @name FindOnePermission
   * @summary 根据id查询权限
   * @request GET:/api/v1/permission/{id}
   */
  findOnePermission = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/permission/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * @description 修改权限
   *
   * @tags permission
   * @name UpdatePermission
   * @summary 修改权限
   * @request PATCH:/api/v1/permission/{id}
   */
  updatePermission = (
    id: string,
    data: UpdatePermissionDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/permission/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 删除权限
   *
   * @tags permission
   * @name RemovePermission
   * @summary 删除权限
   * @request DELETE:/api/v1/permission/{id}
   */
  removePermission = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/permission/${id}`,
      method: "DELETE",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu
   * @name CreateMenu
   * @summary 创建菜单
   * @request POST:/api/v1/menu
   */
  createMenu = (data: CreateMenuRequest, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/menu`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags menu
   * @name FindManyMenu
   * @summary 获取菜单列表
   * @request GET:/api/v1/menu
   */
  findManyMenu = (params: RequestParams = {}) =>
    this.http.request<FindManyMenuResponse, any>({
      path: `/api/v1/menu`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu
   * @name FindOneMenu
   * @summary 获取菜单详情
   * @request GET:/api/v1/menu/{id}
   */
  findOneMenu = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/menu/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu
   * @name UpdateMenu
   * @summary 更新菜单
   * @request PATCH:/api/v1/menu/{id}
   */
  updateMenu = (id: string, data: UpdateMenuDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/menu/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags menu
   * @name RemoveMenu
   * @summary 删除菜单
   * @request DELETE:/api/v1/menu/{id}
   */
  removeMenu = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/menu/${id}`,
      method: "DELETE",
      ...params,
    });

  /**
   * No description
   *
   * @tags task
   * @name TaskControllerCreateV1
   * @summary 创建新的任务
   * @request POST:/api/v1/task
   */
  taskControllerCreateV1 = (
    data: CreateTaskRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/task`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description 支持分页查询
   *
   * @tags task
   * @name TaskControllerFindAllV1
   * @summary 查询任务
   * @request GET:/api/v1/task
   */
  taskControllerFindAllV1 = (
    query?: {
      /**
       * 页码
       * @default 0
       */
      page?: number;
      /**
       * 每页数量
       * @default 10
       */
      limit?: number;
      /** 任务id */
      id?: string;
      /** 创建者id */
      creator?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<FindTaskResponse[], any>({
      path: `/api/v1/task`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags task
   * @name TaskControllerFindOneV1
   * @summary 查询单个任务
   * @request GET:/api/v1/task/{id}
   */
  taskControllerFindOneV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/task/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags task
   * @name TaskControllerUpdateV1
   * @summary 修改任务
   * @request PATCH:/api/v1/task/{id}
   */
  taskControllerUpdateV1 = (
    id: string,
    data: UpdateTaskRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/task/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags task
   * @name TaskControllerRemoveV1
   * @summary 删除任务
   * @request DELETE:/api/v1/task/{id}
   */
  taskControllerRemoveV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/task/${id}`,
      method: "DELETE",
      ...params,
    });
}
