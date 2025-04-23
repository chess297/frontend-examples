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

export interface SuccessResponse {
  /**
   * 服务端处理结果状态码
   * @example 0
   */
  code: number;
  /**
   * 服务端处理结果状态信息
   * @example "success"
   */
  message: string;
  /** 服务端处理结果数据 */
  data: object;
}

export interface CheckSystemInitResponse {
  /** 系统初始化状态 */
  initialized: boolean;
}

export interface SystemCodeEntity {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /**
   * 是否已使用
   * @example false
   */
  is_used: boolean;
  /**
   * 过期时间
   * @format date-time
   * @example "2025-05-22T00:00:00.000Z"
   */
  expires_at: string;
}

export interface AdminRegisterRequest {
  /**
   * 系统码
   * @example "ABCD1234-5678-EFGH-9012-IJKLMNOPQRST"
   */
  systemCode: string;
  /**
   * 管理员用户名
   * @example "admin"
   */
  username: string;
  /**
   * 管理员邮箱
   * @example "admin@example.com"
   */
  email: string;
  /**
   * 管理员密码
   * @example "password123"
   */
  password: string;
  /**
   * 手机号
   * @example "1234567890"
   */
  phone?: string;
  /**
   * 国家代码
   * @example "+86"
   */
  country_code?: string;
  /**
   * 地址
   * @example "北京市朝阳区"
   */
  address?: string;
}

export interface DictionaryItemEntity {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /** 字典ID */
  dictionary_id: string;
  /** 字典项值 */
  value: string;
  /** 字典项标签 */
  label: string;
  /**
   * 排序号
   * @default 0
   */
  sort: number;
  /** 额外数据 */
  extra?: object;
}

export interface DictionaryResponseDto {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /** 字典代码 */
  code: string;
  /** 字典名称 */
  name: string;
  /** 字典描述 */
  description?: object;
  /** 字典项列表 */
  items?: DictionaryItemEntity[];
}

export interface CreateDictionaryDto {
  /** 字典代码 */
  code: string;
  /** 字典名称 */
  name: string;
  /** 字典描述 */
  description?: string;
  /** 字典项列表 */
  items?: any[][];
}

export interface DictionaryListItemDto {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /** 字典代码 */
  code: string;
  /** 字典名称 */
  name: string;
  /** 字典描述 */
  description?: object;
  /** 字典项列表 */
  items?: DictionaryItemEntity[];
  /** 字典项数量 */
  itemCount: number;
}

export interface DictionaryListResponseDto {
  /** 字典列表 */
  data: DictionaryListItemDto[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

export interface DictionaryByCodeResponseDto {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /** 字典代码 */
  code: string;
  /** 字典名称 */
  name: string;
  /** 字典描述 */
  description?: object;
  /** 字典项列表 */
  items?: DictionaryItemEntity[];
}

export interface UpdateDictionaryDto {
  /** 字典代码 */
  code?: string;
  /** 字典名称 */
  name?: string;
  /** 字典描述 */
  description?: string;
  /** 字典项列表 */
  items?: any[][];
}

export type Boolean = object;

export interface SignupRequest {
  /** @example "user" */
  username: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "123456" */
  password: string;
}

export interface SignupResponse {
  id: string;
}

export interface SigninResponse {
  /**
   * 用户ID
   * @example "1"
   */
  id?: string;
  /**
   * 用户邮箱
   * @example "user@example.com"
   */
  email?: string;
  /**
   * 用户名称
   * @example "John Doe"
   */
  username?: string;
  /**
   * 是否是管理员
   * @example false
   */
  is_admin?: boolean;
  /** 用户权限列表 */
  permissions?: string[];
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

export interface BadResponse {
  /**
   * 服务端处理结果状态码
   * @example 400
   */
  code: number;
  /**
   * 服务端处理结果状态信息
   * @example "error"
   */
  message: string;
}

export interface UserEntity {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  username: string;
  email: string;
  is_active: boolean;
  phone: string;
  country_code: string;
  address: string;
  /** 用户头像URL */
  avatar_url?: string;
}

export interface CreateUserRequest {
  password: string;
  username: string;
  email: string;
  is_active: boolean;
  phone: string;
  country_code: string;
  address: string;
  avatar_url: string;
  /** 用户角色id列表 */
  role_ids: string[];
}

export interface PaginationData {
  /**
   * 每页显示条数
   * @example 10
   */
  total: number;
}

export interface PaginationResponse {
  /**
   * 服务端处理结果状态码
   * @example 200
   */
  code: number;
  /**
   * 服务端处理结果状态信息
   * @example "success"
   */
  message: string;
  /** 服务端处理结果数据 */
  data: PaginationData;
}

export interface UserResponse {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  username: string;
  email: string;
  is_active: boolean;
  phone: string;
  country_code: string;
  address: string;
  /** 用户头像URL */
  avatar_url?: string;
}

export interface UpdateUserRequest {
  password?: string;
  username?: string;
  email?: string;
  is_active?: boolean;
  phone?: string;
  country_code?: string;
  address?: string;
  avatar_url?: string;
  /** 用户角色id列表 */
  role_ids?: string[];
}

export interface RemoveUserRequest {
  /** 需要删除的用户id */
  id: string;
  /** 批量删除的用户id列表 */
  ids: string[];
}

export interface UpdateAvatarResponse {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 头像URL */
  avatar_url: string;
}

export interface UpdateAvatarRequest {
  /**
   * 上传的文件
   * @format binary
   */
  file: File;
}

export interface PresignedUrlResponseDto {
  /** 预签名上传 URL */
  url: string;
  /** 上传表单中需要包含的字段 */
  formData: object;
  /** 文件 key（用于后续查询文件） */
  key: string;
  /** 过期时间（秒） */
  expiresIn: number;
}

export interface PresignedUrlRequestDto {
  /**
   * 文件名
   * @example "example.jpg"
   */
  filename: string;
  /**
   * 文件类型
   * @example "image/jpeg"
   */
  contentType: string;
  /**
   * 过期时间（秒）
   * @example 300
   */
  expiry?: number;
}

export interface CompleteUploadDto {
  /**
   * 文件 key
   * @example "5a7b9c4d-1234-5678-90ab-cdefghijklmn.jpg"
   */
  key: string;
  /**
   * 原始文件名
   * @example "example.jpg"
   */
  originalName: string;
  /**
   * 文件类型
   * @example "image/jpeg"
   */
  contentType: string;
  /**
   * 文件大小（字节）
   * @example 1024
   */
  size: number;
}

export interface CreateRoleResponse {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  is_active: boolean;
  /** 角色名称 */
  name: string;
  description: string;
}

export interface CreateRoleRequest {
  /** 角色名称 */
  name: string;
  description: string;
  /** 是否激活 */
  is_active: boolean;
  /** 权限ID列表 */
  permission_ids: string[];
  /** 用户ID列表 */
  user_ids: string[];
}

export interface RoleResponse {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  is_active: boolean;
  /** 角色名称 */
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  /** 角色名称 */
  name?: string;
  description?: string;
  /** 是否激活 */
  is_active?: boolean;
  /** 权限ID列表 */
  permission_ids?: string[];
  /** 用户ID列表 */
  user_ids?: string[];
}

export interface PermissionEntity {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  /** 权限名称 */
  name: string;
  /** 权限描述 */
  description: string;
  /** 权限动作列表 */
  actions: ("manage" | "create" | "update" | "delete" | "read")[];
  /** 资源名称 */
  resource: string;
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

export interface MenuResponse {
  /** 菜单ID */
  id: string;
  /** 父菜单ID */
  parent_id?: object;
  /** 菜单元数据ID */
  mate_id?: string;
  /** 菜单名称 */
  title: string;
  /** 菜单路径 */
  path: object;
  /** 菜单图标 */
  icon: string;
  /** 菜单组件 */
  component: object;
  /**
   * 创建时间
   * @format date-time
   */
  create_at?: string;
  /**
   * 更新时间
   * @format date-time
   */
  update_at?: string;
}

export interface CreateMenuRequest {
  /** 菜单名称 */
  title: string;
  /** 菜单图标 */
  icon: string;
  /** 菜单路径 */
  path: string;
  /** 菜单组件 */
  component: string;
  /** 父级菜单ID */
  parent_id: string;
  /** 菜单分组ID */
  groups: string[];
}

export type Object = object;

export interface UpdateMenuDto {
  /** 菜单名称 */
  title?: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单路径 */
  path?: string;
  /** 菜单组件 */
  component?: string;
  /** 父级菜单ID */
  parent_id?: string;
  /** 菜单分组ID */
  groups?: string[];
}

export interface MenuGroupEntity {
  id: string;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  icon: string;
  description: string;
  title: string;
  parent_id: object;
  menus: MenuResponse[];
}

export interface CreateMenuGroupRequest {
  icon: string;
  description: string;
  title: string;
  menus: string[];
  permissions: string[];
}

export interface UpdateMenuGroupRequest {
  icon?: string;
  description?: string;
  title?: string;
  menus?: string[];
  permissions?: string[];
}

export interface TaskEntity {
  title: string;
  description: string;
  completed: boolean;
  /** @format date-time */
  create_at: string;
  /** @format date-time */
  update_at: string;
  id: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  completed: boolean;
  /** 创建者 */
  creator: string;
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
   * @description 检查系统是否已初始化，如果已初始化返回true，否则返回false
   *
   * @tags system-init
   * @name CheckSystemInit
   * @summary 检查系统是否已初始化
   * @request GET:/api/v1/system-init/check
   */
  checkSystemInit = (params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: CheckSystemInitResponse;
      },
      any
    >({
      path: `/api/v1/system-init/check`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * @description 生成系统初始化码，仅在系统未初始化时可用，用于后续注册管理员账号
   *
   * @tags system-init
   * @name GenerateSystemCode
   * @summary 生成系统初始化码
   * @request POST:/api/v1/system-init/generate-code
   */
  generateSystemCode = (params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: SystemCodeEntity;
      },
      any
    >({
      path: `/api/v1/system-init/generate-code`,
      method: "POST",
      format: "json",
      ...params,
    });

  /**
   * @description 使用系统码注册管理员账号，同时初始化系统
   *
   * @tags system-init
   * @name RegisterAdmin
   * @summary 使用系统码注册管理员账号
   * @request POST:/api/v1/system-init/register-admin
   */
  registerAdmin = (data: AdminRegisterRequest, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/v1/system-init/register-admin`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name DictionaryControllerCreateV1
   * @summary 创建字典
   * @request POST:/api/v1/dictionary
   * @secure
   */
  dictionaryControllerCreateV1 = (
    data: CreateDictionaryDto,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: DictionaryResponseDto;
      },
      any
    >({
      path: `/api/v1/dictionary`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name DictionaryControllerFindAllV1
   * @summary 查询字典列表
   * @request GET:/api/v1/dictionary
   */
  dictionaryControllerFindAllV1 = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
      /** 字典代码 */
      code?: string;
      /** 字典名称 */
      name?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: DictionaryListResponseDto;
      },
      any
    >({
      path: `/api/v1/dictionary`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name FindDistByCode
   * @summary 根据代码查询字典
   * @request GET:/api/v1/dictionary/code/{code}
   */
  findDistByCode = (code: string, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: DictionaryByCodeResponseDto;
      },
      any
    >({
      path: `/api/v1/dictionary/code/${code}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name DictionaryControllerFindOneV1
   * @summary 查询字典详情
   * @request GET:/api/v1/dictionary/{id}
   */
  dictionaryControllerFindOneV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: DictionaryResponseDto;
      },
      any
    >({
      path: `/api/v1/dictionary/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name DictionaryControllerUpdateV1
   * @summary 更新字典
   * @request PATCH:/api/v1/dictionary/{id}
   * @secure
   */
  dictionaryControllerUpdateV1 = (
    id: string,
    data: UpdateDictionaryDto,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: DictionaryResponseDto;
      },
      any
    >({
      path: `/api/v1/dictionary/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags dictionary
   * @name DictionaryControllerRemoveV1
   * @summary 删除字典
   * @request DELETE:/api/v1/dictionary/{id}
   * @secure
   */
  dictionaryControllerRemoveV1 = (id: string, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: Boolean;
      },
      any
    >({
      path: `/api/v1/dictionary/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: SigninResponse;
      },
      BadResponse
    >({
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
   * @name CreateUser
   * @summary 创建新用户
   * @request POST:/api/v1/user
   */
  createUser = (data: CreateUserRequest, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: UserEntity;
      },
      any
    >({
      path: `/api/v1/user`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name QueryUsers
   * @summary 查询多个用户
   * @request GET:/api/v1/user
   */
  queryUsers = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: UserResponse[];
        };
      },
      any
    >({
      path: `/api/v1/user`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name GetUserInfo
   * @summary 获取用户信息
   * @request GET:/api/v1/user/info
   */
  getUserInfo = (params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: UserResponse;
      },
      any
    >({
      path: `/api/v1/user/info`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UpdateUserInfo
   * @summary 获取用户信息
   * @request PATCH:/api/v1/user/info
   */
  updateUserInfo = (data: UpdateUserRequest, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: UserResponse;
      },
      any
    >({
      path: `/api/v1/user/info`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name GetUser
   * @summary 查询单个用户
   * @request GET:/api/v1/user/{id}
   */
  getUser = (id: string, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: UserResponse;
      },
      any
    >({
      path: `/api/v1/user/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name UpdateUserWithId
   * @summary 查询单个用户
   * @request PATCH:/api/v1/user/{id}
   */
  updateUserWithId = (
    id: string,
    data: UpdateUserRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: UserResponse;
      },
      any
    >({
      path: `/api/v1/user/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags user
   * @name RemoveUser
   * @summary 删除单个或多个用户
   * @request DELETE:/api/v1/user/{id}
   */
  removeUser = (
    id: string,
    data?: RemoveUserRequest,
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
   * @tags user
   * @name UploadAvatar
   * @summary 上传用户头像
   * @request POST:/api/v1/user/avatar
   */
  uploadAvatar = (data: UpdateAvatarRequest, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: UpdateAvatarResponse;
      },
      any
    >({
      path: `/api/v1/user/avatar`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags 附件
   * @name AttachmentControllerUploadFileV1
   * @summary 上传文件
   * @request POST:/api/v1/attachment/upload
   */
  attachmentControllerUploadFileV1 = (
    query?: {
      /** 存储类型，LOCAL：本地存储，CLOUD：MinIO存储 */
      storageType?: "LOCAL" | "CLOUD";
    },
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/attachment/upload`,
      method: "POST",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags 附件
   * @name GetUploadUrl
   * @summary 获取预签名上传 URL（前端直传）
   * @request POST:/api/v1/attachment/presigned-url
   */
  getUploadUrl = (data: PresignedUrlRequestDto, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: PresignedUrlResponseDto;
      },
      any
    >({
      path: `/api/v1/attachment/presigned-url`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags 附件
   * @name AttachmentControllerCompleteUploadV1
   * @summary 完成预签名上传（前端直传完成后调用）
   * @request POST:/api/v1/attachment/complete-upload
   */
  attachmentControllerCompleteUploadV1 = (
    data: CompleteUploadDto,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/attachment/complete-upload`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags 附件
   * @name AttachmentControllerGetAttachmentByIdV1
   * @summary 通过ID获取附件信息
   * @request GET:/api/v1/attachment/{id}
   */
  attachmentControllerGetAttachmentByIdV1 = (
    id: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/attachment/${id}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags 附件
   * @name AttachmentControllerServeFileV1
   * @summary 下载/查看文件（兼容旧接口）
   * @request GET:/api/v1/attachment/file/{filename}
   */
  attachmentControllerServeFileV1 = (
    filename: string,
    params: RequestParams = {},
  ) =>
    this.http.request<void, any>({
      path: `/api/v1/attachment/file/${filename}`,
      method: "GET",
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
    this.http.request<
      SuccessResponse & {
        data?: CreateRoleResponse;
      },
      BadResponse
    >({
      path: `/api/v1/role`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
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
  roleControllerFindAllV1 = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: RoleResponse[];
        };
      },
      BadResponse
    >({
      path: `/api/v1/role`,
      method: "GET",
      query: query,
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: RoleResponse;
      },
      any
    >({
      path: `/api/v1/role/${id}`,
      method: "GET",
      format: "json",
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
    data: UpdateRoleRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: RoleResponse;
      },
      any
    >({
      path: `/api/v1/role/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: PermissionEntity;
      },
      any
    >({
      path: `/api/v1/permission`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description 获取当前登录用户的权限
   *
   * @tags permission
   * @name GetUserPermission
   * @summary 获取当前登录用户的权限
   * @request GET:/api/v1/permission
   */
  getUserPermission = (params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: PermissionEntity;
      },
      any
    >({
      path: `/api/v1/permission`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * @description 查询所有权限，支持分页和筛选
   *
   * @tags permission
   * @name FindManyPermission
   * @summary 查询所有权限
   * @request GET:/api/v1/permission/list
   */
  findManyPermission = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
      /** 权限名称 */
      name?: string;
      /** 权限描述 */
      description?: string;
      /** 资源名称 */
      resource?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: PermissionEntity[];
        };
      },
      any
    >({
      path: `/api/v1/permission/list`,
      method: "GET",
      query: query,
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: PermissionEntity;
      },
      any
    >({
      path: `/api/v1/permission/${id}`,
      method: "GET",
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: PermissionEntity;
      },
      any
    >({
      path: `/api/v1/permission/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: MenuResponse;
      },
      any
    >({
      path: `/api/v1/menu`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
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
  findManyMenu = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
      /** 菜单组ID */
      group_id?: string;
      /** 父级菜单ID */
      parent_id?: Object;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: MenuResponse[];
        };
      },
      any
    >({
      path: `/api/v1/menu`,
      method: "GET",
      query: query,
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
    this.http.request<
      SuccessResponse & {
        data?: MenuResponse;
      },
      any
    >({
      path: `/api/v1/menu/${id}`,
      method: "GET",
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: MenuResponse;
      },
      any
    >({
      path: `/api/v1/menu/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
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
   * @tags menu-group
   * @name CreateMenuGroup
   * @summary 创建一个菜单分组
   * @request POST:/api/v1/menu-group
   */
  createMenuGroup = (
    data: CreateMenuGroupRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: MenuGroupEntity;
      },
      any
    >({
      path: `/api/v1/menu-group`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu-group
   * @name QueryMenuGroup
   * @summary 查询菜单分组
   * @request GET:/api/v1/menu-group
   */
  queryMenuGroup = (
    query?: {
      /**
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
       * @default 10
       */
      limit?: number;
      title?: string;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: MenuGroupEntity[];
        };
      },
      any
    >({
      path: `/api/v1/menu-group`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu-group
   * @name FindMenuGroupById
   * @summary 根据id查询菜单分组
   * @request GET:/api/v1/menu-group/{id}
   */
  findMenuGroupById = (id: string, params: RequestParams = {}) =>
    this.http.request<
      SuccessResponse & {
        data?: MenuGroupEntity;
      },
      any
    >({
      path: `/api/v1/menu-group/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu-group
   * @name UpdateMenuGroup
   * @summary 更新菜单分组信息
   * @request PATCH:/api/v1/menu-group/{id}
   */
  updateMenuGroup = (
    id: string,
    data: UpdateMenuGroupRequest,
    params: RequestParams = {},
  ) =>
    this.http.request<
      SuccessResponse & {
        data?: MenuGroupEntity;
      },
      any
    >({
      path: `/api/v1/menu-group/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags menu-group
   * @name DeleteMenuGroup
   * @summary 删除菜单分组
   * @request DELETE:/api/v1/menu-group/{id}
   */
  deleteMenuGroup = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/v1/menu-group/${id}`,
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
    this.http.request<
      SuccessResponse & {
        data?: TaskEntity;
      },
      any
    >({
      path: `/api/v1/task`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
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
       * 当前页码
       * @default 1
       */
      page?: number;
      /**
       * 每页显示条数
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
    this.http.request<
      PaginationResponse & {
        data?: PaginationData & {
          records?: TaskEntity[];
        };
      },
      any
    >({
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
    this.http.request<
      SuccessResponse & {
        data?: TaskEntity;
      },
      any
    >({
      path: `/api/v1/task/${id}`,
      method: "GET",
      format: "json",
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
    this.http.request<
      SuccessResponse & {
        data?: TaskEntity;
      },
      any
    >({
      path: `/api/v1/task/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
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
