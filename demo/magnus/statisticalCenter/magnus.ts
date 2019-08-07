import {
    Double,
    Float,
    Int32,
    Uint32,
    Sint32,
    Fixed32,
    Sfixed32,
    Int64,
    Uint64,
    Sint64,
    Fixed64,
    Sfixed64,
    Bool,
    String,
    Bytes,
    Empty,
} from '@notadd/magnus-core';
import { Observable } from 'rxjs';

export interface Event {
	title: string;
	desc: string;
	count: number;
}
export interface Module {
	title: string;
	events: Event[];
}
export interface GetUserToDoItemsByStartAndEndResult {
	list: Module[];
}
export interface GetUserToDoItemsByStartAndEndInput {
	uid: number;
	start: string;
	end: string;
}
export interface FindRolePermission {
	id: number;
	title: string;
}
export interface FindRoleDate {
	/*序号*/
	id: number;
	/*角色名称*/
	roleName: string;
	/*角色标识*/
	roleIdentification: string;
	/*角色描述*/
	roleDesc: string;
	/*数据权限*/
	dataPermission: FindRolePermission[];
	/*创建人*/
	createUserName: string;
	/*父级角色*/
	parentRoleId: number;
	parentRoleName: string;
	/*创建时间*/
	createDate: string;
}
export interface FindRoleResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
	/*返回数据*/
	data?: FindRoleDate[];
}
export interface FindRoleInput {
/*页码*/	page: number;
/*每页数量*/	psize: number;
/*角色名*/	roleName: string;
/*创建人*/	createUserUsername: string;
/*创建时间 开始and结束*/	createDate: Empty;
}
export interface Role {
	/*角色名称*/
	title: string;
	/*角色id*/
	id: number;
}
export interface SaveResultData {
	/*角色id*/
	id: number;
	/*角色名称*/
	roleName: string;
	/*角色标识*/
	roleIdentification: string;
	/*角色描述*/
	roleDescription: string;
	/*基础角色*/
	basicRole: Role[];
	/*互斥角色*/
	mutexRole: Role[];
	/*状态*/
	status: number;
	/*创建日期*/
	createDate: number;
	/*创建人*/
	createUserName: string;
}
export interface SaveRoleResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
	/*返回数据*/
	data?: SaveResultData;
}
export interface SaveRoleInput {
/*角色id*/	id: number;
/*角色名称*/	roleName: string;
/*角色标识*/	roleIdentification: string;
/*角色描述*/	roleDescription: string;
/*基础角色*/	basicRole: number[];
/*互斥角色*/	mutexRole: number[];
}
export interface StatisticalCenter {
	/*获取指定时间范围内的代办事项*/
	getUserToDoItemsByStartAndEnd(entity: GetUserToDoItemsByStartAndEndInput): Observable<GetUserToDoItemsByStartAndEndResult>;
}
export interface RoleController {
	findRole(entity: FindRoleInput): Observable<FindRoleResult>;
	saveRole(entity: SaveRoleInput): Observable<SaveRoleResult>;
}