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
    Empty
} from '@notadd/magnus-core';
import { Observable } from 'rxjs';

/*域*/
export interface Domain {
	id?: number;
	/*域标题*/
	title?: string;
	/*域编号*/
	code?: string;
	/*域状态*/
	status?: number;
	/*创建人*/
	createUser?: number;
	/*创建时间*/
	createDate?: number;
	/*部门*/
	departments?: Department[];
	getDepartments(__selection?: string): Department[];
}
/*部门表*/
export interface Department {
	/*部门编号*/
	id?: number;
	/*部门名称*/
	title?: string;
	/*部门状态*/
	status?: number;
	/*是否显示*/
	shown?: boolean;
	/*上级部门*/
	parent?: Department;
	/*创建时间*/
	createDate?: number;
	/*下级部门*/
	children?: Department[];
	getChildren(__selection?: string): Department[];
	/*一个部门可以有多个岗位*/
	stations?: Station[];
	getStations(__selection?: string): Station[];
	/*域*/
	domain?: Domain;
	domainId?: number;
}
export interface RoleGroup {
	id?: number;
	/*角色组名*/
	title?: string;
	/*角色组简介*/
	desc?: string;
	/*拥有角色*/
	roles?: Role[];
	getRoles(__selection?: string): Role[];
	/*用到此角色组的岗位*/
	stations?: Station[];
	getStations(__selection?: string): Station[];
}
/*岗位表*/
export interface Station {
	/*岗位序号*/
	id?: number;
	/*岗位标题*/
	title?: string;
	/*岗位描述*/
	desc?: string;
	/*岗位标识码*/
	code?: string;
	/*岗位责任*/
	responsibilities?: string;
	/*岗位要求*/
	requirements?: string;
	/*岗位状态*/
	status?: number;
	/*创建用户*/
	createUser?: User;
	/*创建日期*/
	createDate?: string;
	/*每个岗位有一个部门*/
	department?: Department;
	/*某个岗位可以被什么角色使用*/
	canUseRoles?: Role[];
	users?: User[];
	getUsers(__selection?: string): User[];
	/*一个岗位有一个role group*/
	roleGroup?: RoleGroup;
}
/*角色表*/
export interface Role {
	/*序号*/
	id?: number;
	/*角色标识*/
	code?: string;
	/*角色名称*/
	title?: string;
	/*角色描述*/
	desc?: string;
	/*一个角色可以有多个权限*/
	rights?: SystemRight[];
	getSystemRights(__selection?: string): SystemRight[];
	/*一个角色 可以使用某个岗位的职员*/
	canUseStations?: Station[];
	/*创建时间*/
	createDate?: number;
	/*更新时间*/
	updateDate?: number;
	/*一个角色 被那几个角色组使用*/
	group?: RoleGroup;
}
/*模块来源权限*/
export interface SystemRight {
	id?: number;
	/*权限类型
页面权限、数据权限、功能权限*/
	type?: string;
	/*权限名*/
	title?: string;
	/*命名空间*/
	namespace?: string;
	/*权限代号*/
	code?: string;
	/*权限链接*/
	link?: string;
	/*来源模块*/
	fromSystem?: System;
	/*可用角色*/
	toRoles?: Role;
}
/*模块事件类型*/
export interface SystemEvent {
	id?: number;
	/*权限名*/
	title?: string;
	/*来源模块*/
	fromSystem?: System;
	/*代办事项*/
	toDoItems?: ToDoItem[];
	getToDoItems(__selection?: string): ToDoItem[];
}
/*子系统 子模块*/
export interface System {
	id?: number;
	/*模块名*/
	title?: string;
	/*系统缩略图片*/
	image?: string;
	/*首页链接*/
	link?: string;
	/*模块代号*/
	code?: string;
	/*模块权限*/
	rights?: SystemRight[];
	getSystemRights(__selection?: string): SystemRight[];
	/*模块事件*/
	events?: SystemEvent[];
	getSystemEvents(__selection?: string): SystemEvent[];
	/*代办事项*/
	toDoItems?: ToDoItem[];
	getToDoItems(__selection?: string): ToDoItem[];
	/*配置时间*/
	createDate?: number;
}
export interface ToDoItem {
	/*编号*/
	id?: number;
	/*标题*/
	title?: string;
	/*简介*/
	desc?: string;
	/*创建时间*/
	createDate?: string;
	/*来源模块*/
	fromSystem?: System;
	fromSystemId?: number;
	/*来源事件*/
	fromEvent?: SystemEvent;
	fromEventId?: number;
	/*申请人*/
	fromUser?: User;
	fromUserId?: number;
	/*处理人*/
	toUser?: User;
	toUserId?: number;
}
export interface SafetyScoreRuleInput {
	id?: number;
	/*规则名*/
	title?: string;
	/*代号*/
	code?: string;
	/*分值*/
	score?: number;
	/*是否替换*/
	isReplace?: boolean;
	/*记录*/
	logs?: SafetyScoreLogInput[];
	/*时间*/
	createDate?: number;
}
export interface SafetyScoreLogInput {
	/*编号*/
	id?: number;
	/*扣除分数*/
	score?: number;
	/*一个安全积分记录有一条用户登录日志*/
	loginLog?: UserLoginLogInput;
	/*对应规则*/
	rule?: SafetyScoreRuleInput;
	/*用户*/
	user?: UserInput;
	/*时间*/
	createDate?: number;
}
export interface UserLoginLogInput {
	/*日志编号*/
	id?: number;
	user?: UserInput;
	/*ip地址编号*/
	ip?: string;
	/*设备编号*/
	deviceId?: string;
	/*创建时间*/
	createDate?: number;
	/*一条登录日志有一个扣分日志*/
	scoreLog?: SafetyScoreLogInput;
}
export interface UserInput {
	/*用户编号*/
	id?: number;
	/*用户名*/
	username?: string;
	/*邮箱*/
	email?: string;
	/*头像*/
	avatar?: string;
	/*电话号码*/
	mobile?: string;
	/*密码*/
	password?: string;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封*/
	status?: number;
	/*随机码*/
	randomCode?: string;
	/*密码是否被重置*/
	isRestPassword?: boolean;
	/*密码更改时间*/
	passwordDate?: number;
	/*创建时间*/
	createDate?: number;
	/*这个用户的创建人是谁*/
	createUser?: UserInput;
	/*创建人的uid*/
	createUserId?: number;
	createUsers?: UserInput[];
	/*安全分*/
	safetyScore?: number;
	/*用户的代办事项*/
	toDoItems?: ToDoItemInput[];
	/*发布者*/
	mineToDoItems?: ToDoItemInput[];
	/*用户岗位*/
	stations?: StationInput[];
	/*用户的登录记录*/
	loginLogs?: UserLoginLogInput[];
	/*用户的安全分扣分记录*/
	safetyScoreLogs?: SafetyScoreLogInput[];
	createStations?: StationInput[];
}
export interface DomainInput {
	id?: number;
	/*域标题*/
	title?: string;
	/*域编号*/
	code?: string;
	/*域状态*/
	status?: number;
	/*创建人*/
	createUser?: number;
	/*创建时间*/
	createDate?: number;
	/*部门*/
	departments?: DepartmentInput[];
}
export interface DepartmentInput {
	/*部门编号*/
	id?: number;
	/*部门名称*/
	title?: string;
	/*部门状态*/
	status?: number;
	/*是否显示*/
	shown?: boolean;
	/*上级部门*/
	parent?: DepartmentInput;
	/*创建时间*/
	createDate?: number;
	/*下级部门*/
	children?: DepartmentInput[];
	/*一个部门可以有多个岗位*/
	stations?: StationInput[];
	/*域*/
	domain?: DomainInput;
	domainId?: number;
}
export interface RoleGroupInput {
	id?: number;
	/*角色组名*/
	title?: string;
	/*角色组简介*/
	desc?: string;
	/*拥有角色*/
	roles?: RoleInput[];
	/*用到此角色组的岗位*/
	stations?: StationInput[];
}
export interface StationInput {
	/*岗位序号*/
	id?: number;
	/*岗位标题*/
	title?: string;
	/*岗位描述*/
	desc?: string;
	/*岗位标识码*/
	code?: string;
	/*岗位责任*/
	responsibilities?: string;
	/*岗位要求*/
	requirements?: string;
	/*岗位状态*/
	status?: number;
	/*创建用户*/
	createUser?: UserInput;
	/*创建日期*/
	createDate?: string;
	/*每个岗位有一个部门*/
	department?: DepartmentInput;
	/*某个岗位可以被什么角色使用*/
	canUseRoles?: RoleInput[];
	users?: UserInput[];
	/*一个岗位有一个role group*/
	roleGroup?: RoleGroupInput;
}
export interface RoleInput {
	/*序号*/
	id?: number;
	/*角色标识*/
	code?: string;
	/*角色名称*/
	title?: string;
	/*角色描述*/
	desc?: string;
	/*一个角色可以有多个权限*/
	rights?: SystemRightInput[];
	/*一个角色 可以使用某个岗位的职员*/
	canUseStations?: StationInput[];
	/*创建时间*/
	createDate?: number;
	/*更新时间*/
	updateDate?: number;
	/*一个角色 被那几个角色组使用*/
	group?: RoleGroupInput;
}
export interface SystemRightInput {
	id?: number;
	/*权限类型
页面权限、数据权限、功能权限*/
	type?: string;
	/*权限名*/
	title?: string;
	/*命名空间*/
	namespace?: string;
	/*权限代号*/
	code?: string;
	/*权限链接*/
	link?: string;
	/*来源模块*/
	fromSystem?: SystemInput;
	/*可用角色*/
	toRoles?: RoleInput;
}
export interface SystemEventInput {
	id?: number;
	/*权限名*/
	title?: string;
	/*来源模块*/
	fromSystem?: SystemInput;
	/*代办事项*/
	toDoItems?: ToDoItemInput[];
}
export interface SystemInput {
	id?: number;
	/*模块名*/
	title?: string;
	/*系统缩略图片*/
	image?: string;
	/*首页链接*/
	link?: string;
	/*模块代号*/
	code?: string;
	/*模块权限*/
	rights?: SystemRightInput[];
	/*模块事件*/
	events?: SystemEventInput[];
	/*代办事项*/
	toDoItems?: ToDoItemInput[];
	/*配置时间*/
	createDate?: number;
}
export interface ToDoItemInput {
	/*编号*/
	id?: number;
	/*标题*/
	title?: string;
	/*简介*/
	desc?: string;
	/*创建时间*/
	createDate?: string;
	/*来源模块*/
	fromSystem?: SystemInput;
	fromSystemId?: number;
	/*来源事件*/
	fromEvent?: SystemEventInput;
	fromEventId?: number;
	/*申请人*/
	fromUser?: UserInput;
	fromUserId?: number;
	/*处理人*/
	toUser?: UserInput;
	toUserId?: number;
}
export interface ToDoItemInputWhere {
	/*编号 不等于*/
	id_Not?: number;
	/*编号 在制定内，如[1,2]*/
	id_In?: number[];
	/*编号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*编号 小于*/
	id_Lt?: number;
	/*编号 小于等于*/
	id_Lte?: number;
	/*编号 大于*/
	id_Gt?: number;
	/*编号 大于等于*/
	id_Gte?: number;
	/*编号*/
	id?: number;
	/*标题 不等于*/
	title_Not?: string;
	/*标题 在制定内，如[1,2]*/
	title_In?: string[];
	/*标题 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*标题 小于*/
	title_Lt?: string;
	/*标题 小于等于*/
	title_Lte?: string;
	/*标题 大于*/
	title_Gt?: string;
	/*标题 大于等于*/
	title_Gte?: string;
	/*标题 包含*/
	title_Contains?: string;
	/*标题 不包含*/
	title_NotContains?: string;
	/*标题 开头等于*/
	title_StartsWith?: string;
	/*标题 开头不等于*/
	title_NotStartsWith?: string;
	/*标题 结尾等于*/
	title_EndsWith?: string;
	/*标题 结尾不等于*/
	title_NotEndsWith?: string;
	/*标题*/
	title?: string;
	/*简介 不等于*/
	desc_Not?: string;
	/*简介 在制定内，如[1,2]*/
	desc_In?: string[];
	/*简介 不在制定内,如[1,2]*/
	desc_NotIn?: string[];
	/*简介 小于*/
	desc_Lt?: string;
	/*简介 小于等于*/
	desc_Lte?: string;
	/*简介 大于*/
	desc_Gt?: string;
	/*简介 大于等于*/
	desc_Gte?: string;
	/*简介 包含*/
	desc_Contains?: string;
	/*简介 不包含*/
	desc_NotContains?: string;
	/*简介 开头等于*/
	desc_StartsWith?: string;
	/*简介 开头不等于*/
	desc_NotStartsWith?: string;
	/*简介 结尾等于*/
	desc_EndsWith?: string;
	/*简介 结尾不等于*/
	desc_NotEndsWith?: string;
	/*简介*/
	desc?: string;
	/*创建时间 不等于*/
	createDate_Not?: string;
	/*创建时间 在制定内，如[1,2]*/
	createDate_In?: string[];
	/*创建时间 不在制定内,如[1,2]*/
	createDate_NotIn?: string[];
	/*创建时间 小于*/
	createDate_Lt?: string;
	/*创建时间 小于等于*/
	createDate_Lte?: string;
	/*创建时间 大于*/
	createDate_Gt?: string;
	/*创建时间 大于等于*/
	createDate_Gte?: string;
	/*创建时间 包含*/
	createDate_Contains?: string;
	/*创建时间 不包含*/
	createDate_NotContains?: string;
	/*创建时间 开头等于*/
	createDate_StartsWith?: string;
	/*创建时间 开头不等于*/
	createDate_NotStartsWith?: string;
	/*创建时间 结尾等于*/
	createDate_EndsWith?: string;
	/*创建时间 结尾不等于*/
	createDate_NotEndsWith?: string;
	/*创建时间*/
	createDate?: string;
	/**/
	fromSystemId_Not?: number;
	/**/
	fromSystemId_In?: number[];
	/**/
	fromSystemId_NotIn?: number[];
	/**/
	fromSystemId_Lt?: number;
	/**/
	fromSystemId_Lte?: number;
	/**/
	fromSystemId_Gt?: number;
	/**/
	fromSystemId_Gte?: number;
	fromSystemId?: number;
	/**/
	fromEventId_Not?: number;
	/**/
	fromEventId_In?: number[];
	/**/
	fromEventId_NotIn?: number[];
	/**/
	fromEventId_Lt?: number;
	/**/
	fromEventId_Lte?: number;
	/**/
	fromEventId_Gt?: number;
	/**/
	fromEventId_Gte?: number;
	fromEventId?: number;
	/**/
	fromUserId_Not?: number;
	/**/
	fromUserId_In?: number[];
	/**/
	fromUserId_NotIn?: number[];
	/**/
	fromUserId_Lt?: number;
	/**/
	fromUserId_Lte?: number;
	/**/
	fromUserId_Gt?: number;
	/**/
	fromUserId_Gte?: number;
	fromUserId?: number;
	/**/
	toUserId_Not?: number;
	/**/
	toUserId_In?: number[];
	/**/
	toUserId_NotIn?: number[];
	/**/
	toUserId_Lt?: number;
	/**/
	toUserId_Lte?: number;
	/**/
	toUserId_Gt?: number;
	/**/
	toUserId_Gte?: number;
	toUserId?: number;
	AND?: ToDoItemInputWhere[];
	OR?: ToDoItemInputWhere[];
	NOT?: ToDoItemInputWhere[];
}
export interface ToDoItemInputOrder {
	/*编号
排序可选值为ASC或者DESC*/
	id?: string;
	/*标题
排序可选值为ASC或者DESC*/
	title?: string;
	/*简介
排序可选值为ASC或者DESC*/
	desc?: string;
	/*创建时间
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*来源模块
排序可选值为ASC或者DESC*/
	fromSystem?: string;
	fromSystemId?: string;
	/*来源事件
排序可选值为ASC或者DESC*/
	fromEvent?: string;
	fromEventId?: string;
	/*申请人
排序可选值为ASC或者DESC*/
	fromUser?: string;
	fromUserId?: string;
	/*处理人
排序可选值为ASC或者DESC*/
	toUser?: string;
	toUserId?: string;
}
export interface PageLimitInput {
/*页码*/	page: number;
/*每页数量*/	psize: number;
}
export interface StationInputWhere {
	/*岗位序号 不等于*/
	id_Not?: number;
	/*岗位序号 在制定内，如[1,2]*/
	id_In?: number[];
	/*岗位序号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*岗位序号 小于*/
	id_Lt?: number;
	/*岗位序号 小于等于*/
	id_Lte?: number;
	/*岗位序号 大于*/
	id_Gt?: number;
	/*岗位序号 大于等于*/
	id_Gte?: number;
	/*岗位序号*/
	id?: number;
	/*岗位标题 不等于*/
	title_Not?: string;
	/*岗位标题 在制定内，如[1,2]*/
	title_In?: string[];
	/*岗位标题 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*岗位标题 小于*/
	title_Lt?: string;
	/*岗位标题 小于等于*/
	title_Lte?: string;
	/*岗位标题 大于*/
	title_Gt?: string;
	/*岗位标题 大于等于*/
	title_Gte?: string;
	/*岗位标题 包含*/
	title_Contains?: string;
	/*岗位标题 不包含*/
	title_NotContains?: string;
	/*岗位标题 开头等于*/
	title_StartsWith?: string;
	/*岗位标题 开头不等于*/
	title_NotStartsWith?: string;
	/*岗位标题 结尾等于*/
	title_EndsWith?: string;
	/*岗位标题 结尾不等于*/
	title_NotEndsWith?: string;
	/*岗位标题*/
	title?: string;
	/*岗位描述 不等于*/
	desc_Not?: string;
	/*岗位描述 在制定内，如[1,2]*/
	desc_In?: string[];
	/*岗位描述 不在制定内,如[1,2]*/
	desc_NotIn?: string[];
	/*岗位描述 小于*/
	desc_Lt?: string;
	/*岗位描述 小于等于*/
	desc_Lte?: string;
	/*岗位描述 大于*/
	desc_Gt?: string;
	/*岗位描述 大于等于*/
	desc_Gte?: string;
	/*岗位描述 包含*/
	desc_Contains?: string;
	/*岗位描述 不包含*/
	desc_NotContains?: string;
	/*岗位描述 开头等于*/
	desc_StartsWith?: string;
	/*岗位描述 开头不等于*/
	desc_NotStartsWith?: string;
	/*岗位描述 结尾等于*/
	desc_EndsWith?: string;
	/*岗位描述 结尾不等于*/
	desc_NotEndsWith?: string;
	/*岗位描述*/
	desc?: string;
	/*岗位标识码 不等于*/
	code_Not?: string;
	/*岗位标识码 在制定内，如[1,2]*/
	code_In?: string[];
	/*岗位标识码 不在制定内,如[1,2]*/
	code_NotIn?: string[];
	/*岗位标识码 小于*/
	code_Lt?: string;
	/*岗位标识码 小于等于*/
	code_Lte?: string;
	/*岗位标识码 大于*/
	code_Gt?: string;
	/*岗位标识码 大于等于*/
	code_Gte?: string;
	/*岗位标识码 包含*/
	code_Contains?: string;
	/*岗位标识码 不包含*/
	code_NotContains?: string;
	/*岗位标识码 开头等于*/
	code_StartsWith?: string;
	/*岗位标识码 开头不等于*/
	code_NotStartsWith?: string;
	/*岗位标识码 结尾等于*/
	code_EndsWith?: string;
	/*岗位标识码 结尾不等于*/
	code_NotEndsWith?: string;
	/*岗位标识码*/
	code?: string;
	/*岗位责任 不等于*/
	responsibilities_Not?: string;
	/*岗位责任 在制定内，如[1,2]*/
	responsibilities_In?: string[];
	/*岗位责任 不在制定内,如[1,2]*/
	responsibilities_NotIn?: string[];
	/*岗位责任 小于*/
	responsibilities_Lt?: string;
	/*岗位责任 小于等于*/
	responsibilities_Lte?: string;
	/*岗位责任 大于*/
	responsibilities_Gt?: string;
	/*岗位责任 大于等于*/
	responsibilities_Gte?: string;
	/*岗位责任 包含*/
	responsibilities_Contains?: string;
	/*岗位责任 不包含*/
	responsibilities_NotContains?: string;
	/*岗位责任 开头等于*/
	responsibilities_StartsWith?: string;
	/*岗位责任 开头不等于*/
	responsibilities_NotStartsWith?: string;
	/*岗位责任 结尾等于*/
	responsibilities_EndsWith?: string;
	/*岗位责任 结尾不等于*/
	responsibilities_NotEndsWith?: string;
	/*岗位责任*/
	responsibilities?: string;
	/*岗位要求 不等于*/
	requirements_Not?: string;
	/*岗位要求 在制定内，如[1,2]*/
	requirements_In?: string[];
	/*岗位要求 不在制定内,如[1,2]*/
	requirements_NotIn?: string[];
	/*岗位要求 小于*/
	requirements_Lt?: string;
	/*岗位要求 小于等于*/
	requirements_Lte?: string;
	/*岗位要求 大于*/
	requirements_Gt?: string;
	/*岗位要求 大于等于*/
	requirements_Gte?: string;
	/*岗位要求 包含*/
	requirements_Contains?: string;
	/*岗位要求 不包含*/
	requirements_NotContains?: string;
	/*岗位要求 开头等于*/
	requirements_StartsWith?: string;
	/*岗位要求 开头不等于*/
	requirements_NotStartsWith?: string;
	/*岗位要求 结尾等于*/
	requirements_EndsWith?: string;
	/*岗位要求 结尾不等于*/
	requirements_NotEndsWith?: string;
	/*岗位要求*/
	requirements?: string;
	/*岗位状态 不等于*/
	status_Not?: number;
	/*岗位状态 在制定内，如[1,2]*/
	status_In?: number[];
	/*岗位状态 不在制定内,如[1,2]*/
	status_NotIn?: number[];
	/*岗位状态 小于*/
	status_Lt?: number;
	/*岗位状态 小于等于*/
	status_Lte?: number;
	/*岗位状态 大于*/
	status_Gt?: number;
	/*岗位状态 大于等于*/
	status_Gte?: number;
	/*岗位状态*/
	status?: number;
	/*创建日期 不等于*/
	createDate_Not?: string;
	/*创建日期 在制定内，如[1,2]*/
	createDate_In?: string[];
	/*创建日期 不在制定内,如[1,2]*/
	createDate_NotIn?: string[];
	/*创建日期 小于*/
	createDate_Lt?: string;
	/*创建日期 小于等于*/
	createDate_Lte?: string;
	/*创建日期 大于*/
	createDate_Gt?: string;
	/*创建日期 大于等于*/
	createDate_Gte?: string;
	/*创建日期 包含*/
	createDate_Contains?: string;
	/*创建日期 不包含*/
	createDate_NotContains?: string;
	/*创建日期 开头等于*/
	createDate_StartsWith?: string;
	/*创建日期 开头不等于*/
	createDate_NotStartsWith?: string;
	/*创建日期 结尾等于*/
	createDate_EndsWith?: string;
	/*创建日期 结尾不等于*/
	createDate_NotEndsWith?: string;
	/*创建日期*/
	createDate?: string;
	AND?: StationInputWhere[];
	OR?: StationInputWhere[];
	NOT?: StationInputWhere[];
}
export interface StationInputOrder {
	/*岗位序号
排序可选值为ASC或者DESC*/
	id?: string;
	/*岗位标题
排序可选值为ASC或者DESC*/
	title?: string;
	/*岗位描述
排序可选值为ASC或者DESC*/
	desc?: string;
	/*岗位标识码
排序可选值为ASC或者DESC*/
	code?: string;
	/*岗位责任
排序可选值为ASC或者DESC*/
	responsibilities?: string;
	/*岗位要求
排序可选值为ASC或者DESC*/
	requirements?: string;
	/*岗位状态
排序可选值为ASC或者DESC*/
	status?: string;
	/*创建用户
排序可选值为ASC或者DESC*/
	createUser?: string;
	/*创建日期
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*每个岗位有一个部门
排序可选值为ASC或者DESC*/
	department?: string;
	/*某个岗位可以被什么角色使用
排序可选值为ASC或者DESC*/
	canUseRoles?: string;
	users?: string;
	/*一个岗位有一个role group
排序可选值为ASC或者DESC*/
	roleGroup?: string;
}
export interface SafetyScoreRule {
	id?: number;
	/*规则名*/
	title?: string;
	/*代号*/
	code?: string;
	/*分值*/
	score?: number;
	/*是否替换*/
	isReplace?: boolean;
	/*记录*/
	logs?: SafetyScoreLog[];
	getSafetyScoreLogs(__selection?: string): SafetyScoreLog[];
	/*时间*/
	createDate?: number;
}
/*用户安全分扣除记录*/
export interface SafetyScoreLog {
	/*编号*/
	id?: number;
	/*扣除分数*/
	score?: number;
	/*一个安全积分记录有一条用户登录日志*/
	loginLog?: UserLoginLog;
	/*对应规则*/
	rule?: SafetyScoreRule;
	/*用户*/
	user?: User;
	/*时间*/
	createDate?: number;
}
/*用户登录日志表*/
export interface UserLoginLog {
	/*日志编号*/
	id?: number;
	user?: User;
	/*ip地址编号*/
	ip?: string;
	/*设备编号*/
	deviceId?: string;
	/*创建时间*/
	createDate?: number;
	/*一条登录日志有一个扣分日志*/
	scoreLog?: SafetyScoreLog;
}
export interface UserLoginLogInputWhere {
	/*日志编号 不等于*/
	id_Not?: number;
	/*日志编号 在制定内，如[1,2]*/
	id_In?: number[];
	/*日志编号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*日志编号 小于*/
	id_Lt?: number;
	/*日志编号 小于等于*/
	id_Lte?: number;
	/*日志编号 大于*/
	id_Gt?: number;
	/*日志编号 大于等于*/
	id_Gte?: number;
	/*日志编号*/
	id?: number;
	/*ip地址编号 不等于*/
	ip_Not?: string;
	/*ip地址编号 在制定内，如[1,2]*/
	ip_In?: string[];
	/*ip地址编号 不在制定内,如[1,2]*/
	ip_NotIn?: string[];
	/*ip地址编号 小于*/
	ip_Lt?: string;
	/*ip地址编号 小于等于*/
	ip_Lte?: string;
	/*ip地址编号 大于*/
	ip_Gt?: string;
	/*ip地址编号 大于等于*/
	ip_Gte?: string;
	/*ip地址编号 包含*/
	ip_Contains?: string;
	/*ip地址编号 不包含*/
	ip_NotContains?: string;
	/*ip地址编号 开头等于*/
	ip_StartsWith?: string;
	/*ip地址编号 开头不等于*/
	ip_NotStartsWith?: string;
	/*ip地址编号 结尾等于*/
	ip_EndsWith?: string;
	/*ip地址编号 结尾不等于*/
	ip_NotEndsWith?: string;
	/*ip地址编号*/
	ip?: string;
	/*设备编号 不等于*/
	deviceId_Not?: string;
	/*设备编号 在制定内，如[1,2]*/
	deviceId_In?: string[];
	/*设备编号 不在制定内,如[1,2]*/
	deviceId_NotIn?: string[];
	/*设备编号 小于*/
	deviceId_Lt?: string;
	/*设备编号 小于等于*/
	deviceId_Lte?: string;
	/*设备编号 大于*/
	deviceId_Gt?: string;
	/*设备编号 大于等于*/
	deviceId_Gte?: string;
	/*设备编号 包含*/
	deviceId_Contains?: string;
	/*设备编号 不包含*/
	deviceId_NotContains?: string;
	/*设备编号 开头等于*/
	deviceId_StartsWith?: string;
	/*设备编号 开头不等于*/
	deviceId_NotStartsWith?: string;
	/*设备编号 结尾等于*/
	deviceId_EndsWith?: string;
	/*设备编号 结尾不等于*/
	deviceId_NotEndsWith?: string;
	/*设备编号*/
	deviceId?: string;
	/*创建时间 不等于*/
	createDate_Not?: number;
	/*创建时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*创建时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*创建时间 小于*/
	createDate_Lt?: number;
	/*创建时间 小于等于*/
	createDate_Lte?: number;
	/*创建时间 大于*/
	createDate_Gt?: number;
	/*创建时间 大于等于*/
	createDate_Gte?: number;
	/*创建时间*/
	createDate?: number;
	AND?: UserLoginLogInputWhere[];
	OR?: UserLoginLogInputWhere[];
	NOT?: UserLoginLogInputWhere[];
}
export interface UserLoginLogInputOrder {
	/*日志编号
排序可选值为ASC或者DESC*/
	id?: string;
	user?: string;
	/*ip地址编号
排序可选值为ASC或者DESC*/
	ip?: string;
	/*设备编号
排序可选值为ASC或者DESC*/
	deviceId?: string;
	/*创建时间
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*一条登录日志有一个扣分日志
排序可选值为ASC或者DESC*/
	scoreLog?: string;
}
export interface SafetyScoreLogInputWhere {
	/*编号 不等于*/
	id_Not?: number;
	/*编号 在制定内，如[1,2]*/
	id_In?: number[];
	/*编号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*编号 小于*/
	id_Lt?: number;
	/*编号 小于等于*/
	id_Lte?: number;
	/*编号 大于*/
	id_Gt?: number;
	/*编号 大于等于*/
	id_Gte?: number;
	/*编号*/
	id?: number;
	/*扣除分数 不等于*/
	score_Not?: number;
	/*扣除分数 在制定内，如[1,2]*/
	score_In?: number[];
	/*扣除分数 不在制定内,如[1,2]*/
	score_NotIn?: number[];
	/*扣除分数 小于*/
	score_Lt?: number;
	/*扣除分数 小于等于*/
	score_Lte?: number;
	/*扣除分数 大于*/
	score_Gt?: number;
	/*扣除分数 大于等于*/
	score_Gte?: number;
	/*扣除分数*/
	score?: number;
	/*时间 不等于*/
	createDate_Not?: number;
	/*时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*时间 小于*/
	createDate_Lt?: number;
	/*时间 小于等于*/
	createDate_Lte?: number;
	/*时间 大于*/
	createDate_Gt?: number;
	/*时间 大于等于*/
	createDate_Gte?: number;
	/*时间*/
	createDate?: number;
	AND?: SafetyScoreLogInputWhere[];
	OR?: SafetyScoreLogInputWhere[];
	NOT?: SafetyScoreLogInputWhere[];
}
export interface SafetyScoreLogInputOrder {
	/*编号
排序可选值为ASC或者DESC*/
	id?: string;
	/*扣除分数
排序可选值为ASC或者DESC*/
	score?: string;
	/*一个安全积分记录有一条用户登录日志
排序可选值为ASC或者DESC*/
	loginLog?: string;
	/*对应规则
排序可选值为ASC或者DESC*/
	rule?: string;
	/*用户
排序可选值为ASC或者DESC*/
	user?: string;
	/*时间
排序可选值为ASC或者DESC*/
	createDate?: string;
}
/*用户表*/
export interface User {
	/*用户编号*/
	id?: number;
	/*用户名*/
	username?: string;
	/*邮箱*/
	email?: string;
	/*头像*/
	avatar?: string;
	/*电话号码*/
	mobile?: string;
	/*密码*/
	password?: string;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封*/
	status?: number;
	/*随机码*/
	randomCode?: string;
	/*密码是否被重置*/
	isRestPassword?: boolean;
	/*密码更改时间*/
	passwordDate?: number;
	/*创建时间*/
	createDate?: number;
	/*这个用户的创建人是谁*/
	createUser?: User;
	/*创建人的uid*/
	createUserId?: number;
	createUsers?: User[];
	/*安全分*/
	safetyScore?: number;
	/*用户的代办事项*/
	toDoItems?: ToDoItem[];
	/*发布者*/
	mineToDoItems?: ToDoItem[];
	getToDoItems(where?: ToDoItemInputWhere, order?: ToDoItemInputOrder, limit?: PageLimitInput, __selection?: string): ToDoItem[];
	/*用户岗位*/
	stations?: Station[];
	getStations(where?: StationInputWhere, order?: StationInputOrder, limit?: PageLimitInput, __selection?: string): Station[];
	/*用户的登录记录*/
	loginLogs?: UserLoginLog[];
	getUserLoginLogs(where?: UserLoginLogInputWhere, order?: UserLoginLogInputOrder, limit?: PageLimitInput, __selection?: string): UserLoginLog[];
	/*用户的安全分扣分记录*/
	safetyScoreLogs?: SafetyScoreLog[];
	getSafetyScoreLogs(where?: SafetyScoreLogInputWhere, order?: SafetyScoreLogInputOrder, limit?: PageLimitInput, __selection?: string): SafetyScoreLog[];
	createStations?: Station[];
	getCreateStations(where?: StationInputWhere, order?: StationInputOrder, limit?: PageLimitInput, __selection?: string): Station[];
}
export interface UserInputWhere {
	/*用户编号 不等于*/
	id_Not?: number;
	/*用户编号 在制定内，如[1,2]*/
	id_In?: number[];
	/*用户编号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*用户编号 小于*/
	id_Lt?: number;
	/*用户编号 小于等于*/
	id_Lte?: number;
	/*用户编号 大于*/
	id_Gt?: number;
	/*用户编号 大于等于*/
	id_Gte?: number;
	/*用户编号*/
	id?: number;
	/*用户名 不等于*/
	username_Not?: string;
	/*用户名 在制定内，如[1,2]*/
	username_In?: string[];
	/*用户名 不在制定内,如[1,2]*/
	username_NotIn?: string[];
	/*用户名 小于*/
	username_Lt?: string;
	/*用户名 小于等于*/
	username_Lte?: string;
	/*用户名 大于*/
	username_Gt?: string;
	/*用户名 大于等于*/
	username_Gte?: string;
	/*用户名 包含*/
	username_Contains?: string;
	/*用户名 不包含*/
	username_NotContains?: string;
	/*用户名 开头等于*/
	username_StartsWith?: string;
	/*用户名 开头不等于*/
	username_NotStartsWith?: string;
	/*用户名 结尾等于*/
	username_EndsWith?: string;
	/*用户名 结尾不等于*/
	username_NotEndsWith?: string;
	/*用户名*/
	username?: string;
	/*邮箱 不等于*/
	email_Not?: string;
	/*邮箱 在制定内，如[1,2]*/
	email_In?: string[];
	/*邮箱 不在制定内,如[1,2]*/
	email_NotIn?: string[];
	/*邮箱 小于*/
	email_Lt?: string;
	/*邮箱 小于等于*/
	email_Lte?: string;
	/*邮箱 大于*/
	email_Gt?: string;
	/*邮箱 大于等于*/
	email_Gte?: string;
	/*邮箱 包含*/
	email_Contains?: string;
	/*邮箱 不包含*/
	email_NotContains?: string;
	/*邮箱 开头等于*/
	email_StartsWith?: string;
	/*邮箱 开头不等于*/
	email_NotStartsWith?: string;
	/*邮箱 结尾等于*/
	email_EndsWith?: string;
	/*邮箱 结尾不等于*/
	email_NotEndsWith?: string;
	/*邮箱*/
	email?: string;
	/*头像 不等于*/
	avatar_Not?: string;
	/*头像 在制定内，如[1,2]*/
	avatar_In?: string[];
	/*头像 不在制定内,如[1,2]*/
	avatar_NotIn?: string[];
	/*头像 小于*/
	avatar_Lt?: string;
	/*头像 小于等于*/
	avatar_Lte?: string;
	/*头像 大于*/
	avatar_Gt?: string;
	/*头像 大于等于*/
	avatar_Gte?: string;
	/*头像 包含*/
	avatar_Contains?: string;
	/*头像 不包含*/
	avatar_NotContains?: string;
	/*头像 开头等于*/
	avatar_StartsWith?: string;
	/*头像 开头不等于*/
	avatar_NotStartsWith?: string;
	/*头像 结尾等于*/
	avatar_EndsWith?: string;
	/*头像 结尾不等于*/
	avatar_NotEndsWith?: string;
	/*头像*/
	avatar?: string;
	/*电话号码 不等于*/
	mobile_Not?: string;
	/*电话号码 在制定内，如[1,2]*/
	mobile_In?: string[];
	/*电话号码 不在制定内,如[1,2]*/
	mobile_NotIn?: string[];
	/*电话号码 小于*/
	mobile_Lt?: string;
	/*电话号码 小于等于*/
	mobile_Lte?: string;
	/*电话号码 大于*/
	mobile_Gt?: string;
	/*电话号码 大于等于*/
	mobile_Gte?: string;
	/*电话号码 包含*/
	mobile_Contains?: string;
	/*电话号码 不包含*/
	mobile_NotContains?: string;
	/*电话号码 开头等于*/
	mobile_StartsWith?: string;
	/*电话号码 开头不等于*/
	mobile_NotStartsWith?: string;
	/*电话号码 结尾等于*/
	mobile_EndsWith?: string;
	/*电话号码 结尾不等于*/
	mobile_NotEndsWith?: string;
	/*电话号码*/
	mobile?: string;
	/*密码 不等于*/
	password_Not?: string;
	/*密码 在制定内，如[1,2]*/
	password_In?: string[];
	/*密码 不在制定内,如[1,2]*/
	password_NotIn?: string[];
	/*密码 小于*/
	password_Lt?: string;
	/*密码 小于等于*/
	password_Lte?: string;
	/*密码 大于*/
	password_Gt?: string;
	/*密码 大于等于*/
	password_Gte?: string;
	/*密码 包含*/
	password_Contains?: string;
	/*密码 不包含*/
	password_NotContains?: string;
	/*密码 开头等于*/
	password_StartsWith?: string;
	/*密码 开头不等于*/
	password_NotStartsWith?: string;
	/*密码 结尾等于*/
	password_EndsWith?: string;
	/*密码 结尾不等于*/
	password_NotEndsWith?: string;
	/*密码*/
	password?: string;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 不等于*/
	status_Not?: number;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 在制定内，如[1,2]*/
	status_In?: number[];
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 不在制定内,如[1,2]*/
	status_NotIn?: number[];
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 小于*/
	status_Lt?: number;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 小于等于*/
	status_Lte?: number;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 大于*/
	status_Gt?: number;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封 大于等于*/
	status_Gte?: number;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封*/
	status?: number;
	/*随机码 不等于*/
	randomCode_Not?: string;
	/*随机码 在制定内，如[1,2]*/
	randomCode_In?: string[];
	/*随机码 不在制定内,如[1,2]*/
	randomCode_NotIn?: string[];
	/*随机码 小于*/
	randomCode_Lt?: string;
	/*随机码 小于等于*/
	randomCode_Lte?: string;
	/*随机码 大于*/
	randomCode_Gt?: string;
	/*随机码 大于等于*/
	randomCode_Gte?: string;
	/*随机码 包含*/
	randomCode_Contains?: string;
	/*随机码 不包含*/
	randomCode_NotContains?: string;
	/*随机码 开头等于*/
	randomCode_StartsWith?: string;
	/*随机码 开头不等于*/
	randomCode_NotStartsWith?: string;
	/*随机码 结尾等于*/
	randomCode_EndsWith?: string;
	/*随机码 结尾不等于*/
	randomCode_NotEndsWith?: string;
	/*随机码*/
	randomCode?: string;
	/*密码更改时间 不等于*/
	passwordDate_Not?: number;
	/*密码更改时间 在制定内，如[1,2]*/
	passwordDate_In?: number[];
	/*密码更改时间 不在制定内,如[1,2]*/
	passwordDate_NotIn?: number[];
	/*密码更改时间 小于*/
	passwordDate_Lt?: number;
	/*密码更改时间 小于等于*/
	passwordDate_Lte?: number;
	/*密码更改时间 大于*/
	passwordDate_Gt?: number;
	/*密码更改时间 大于等于*/
	passwordDate_Gte?: number;
	/*密码更改时间*/
	passwordDate?: number;
	/*创建时间 不等于*/
	createDate_Not?: number;
	/*创建时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*创建时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*创建时间 小于*/
	createDate_Lt?: number;
	/*创建时间 小于等于*/
	createDate_Lte?: number;
	/*创建时间 大于*/
	createDate_Gt?: number;
	/*创建时间 大于等于*/
	createDate_Gte?: number;
	/*创建时间*/
	createDate?: number;
	/*创建人的uid 不等于*/
	createUserId_Not?: number;
	/*创建人的uid 在制定内，如[1,2]*/
	createUserId_In?: number[];
	/*创建人的uid 不在制定内,如[1,2]*/
	createUserId_NotIn?: number[];
	/*创建人的uid 小于*/
	createUserId_Lt?: number;
	/*创建人的uid 小于等于*/
	createUserId_Lte?: number;
	/*创建人的uid 大于*/
	createUserId_Gt?: number;
	/*创建人的uid 大于等于*/
	createUserId_Gte?: number;
	/*创建人的uid*/
	createUserId?: number;
	/*安全分 不等于*/
	safetyScore_Not?: number;
	/*安全分 在制定内，如[1,2]*/
	safetyScore_In?: number[];
	/*安全分 不在制定内,如[1,2]*/
	safetyScore_NotIn?: number[];
	/*安全分 小于*/
	safetyScore_Lt?: number;
	/*安全分 小于等于*/
	safetyScore_Lte?: number;
	/*安全分 大于*/
	safetyScore_Gt?: number;
	/*安全分 大于等于*/
	safetyScore_Gte?: number;
	/*安全分*/
	safetyScore?: number;
	AND?: UserInputWhere[];
	OR?: UserInputWhere[];
	NOT?: UserInputWhere[];
}
export interface SystemInputWhere {
	/**/
	id_Not?: number;
	/**/
	id_In?: number[];
	/**/
	id_NotIn?: number[];
	/**/
	id_Lt?: number;
	/**/
	id_Lte?: number;
	/**/
	id_Gt?: number;
	/**/
	id_Gte?: number;
	id?: number;
	/*模块名 不等于*/
	title_Not?: string;
	/*模块名 在制定内，如[1,2]*/
	title_In?: string[];
	/*模块名 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*模块名 小于*/
	title_Lt?: string;
	/*模块名 小于等于*/
	title_Lte?: string;
	/*模块名 大于*/
	title_Gt?: string;
	/*模块名 大于等于*/
	title_Gte?: string;
	/*模块名 包含*/
	title_Contains?: string;
	/*模块名 不包含*/
	title_NotContains?: string;
	/*模块名 开头等于*/
	title_StartsWith?: string;
	/*模块名 开头不等于*/
	title_NotStartsWith?: string;
	/*模块名 结尾等于*/
	title_EndsWith?: string;
	/*模块名 结尾不等于*/
	title_NotEndsWith?: string;
	/*模块名*/
	title?: string;
	/*系统缩略图片 不等于*/
	image_Not?: string;
	/*系统缩略图片 在制定内，如[1,2]*/
	image_In?: string[];
	/*系统缩略图片 不在制定内,如[1,2]*/
	image_NotIn?: string[];
	/*系统缩略图片 小于*/
	image_Lt?: string;
	/*系统缩略图片 小于等于*/
	image_Lte?: string;
	/*系统缩略图片 大于*/
	image_Gt?: string;
	/*系统缩略图片 大于等于*/
	image_Gte?: string;
	/*系统缩略图片 包含*/
	image_Contains?: string;
	/*系统缩略图片 不包含*/
	image_NotContains?: string;
	/*系统缩略图片 开头等于*/
	image_StartsWith?: string;
	/*系统缩略图片 开头不等于*/
	image_NotStartsWith?: string;
	/*系统缩略图片 结尾等于*/
	image_EndsWith?: string;
	/*系统缩略图片 结尾不等于*/
	image_NotEndsWith?: string;
	/*系统缩略图片*/
	image?: string;
	/*首页链接 不等于*/
	link_Not?: string;
	/*首页链接 在制定内，如[1,2]*/
	link_In?: string[];
	/*首页链接 不在制定内,如[1,2]*/
	link_NotIn?: string[];
	/*首页链接 小于*/
	link_Lt?: string;
	/*首页链接 小于等于*/
	link_Lte?: string;
	/*首页链接 大于*/
	link_Gt?: string;
	/*首页链接 大于等于*/
	link_Gte?: string;
	/*首页链接 包含*/
	link_Contains?: string;
	/*首页链接 不包含*/
	link_NotContains?: string;
	/*首页链接 开头等于*/
	link_StartsWith?: string;
	/*首页链接 开头不等于*/
	link_NotStartsWith?: string;
	/*首页链接 结尾等于*/
	link_EndsWith?: string;
	/*首页链接 结尾不等于*/
	link_NotEndsWith?: string;
	/*首页链接*/
	link?: string;
	/*模块代号 不等于*/
	code_Not?: string;
	/*模块代号 在制定内，如[1,2]*/
	code_In?: string[];
	/*模块代号 不在制定内,如[1,2]*/
	code_NotIn?: string[];
	/*模块代号 小于*/
	code_Lt?: string;
	/*模块代号 小于等于*/
	code_Lte?: string;
	/*模块代号 大于*/
	code_Gt?: string;
	/*模块代号 大于等于*/
	code_Gte?: string;
	/*模块代号 包含*/
	code_Contains?: string;
	/*模块代号 不包含*/
	code_NotContains?: string;
	/*模块代号 开头等于*/
	code_StartsWith?: string;
	/*模块代号 开头不等于*/
	code_NotStartsWith?: string;
	/*模块代号 结尾等于*/
	code_EndsWith?: string;
	/*模块代号 结尾不等于*/
	code_NotEndsWith?: string;
	/*模块代号*/
	code?: string;
	/*配置时间 不等于*/
	createDate_Not?: number;
	/*配置时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*配置时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*配置时间 小于*/
	createDate_Lt?: number;
	/*配置时间 小于等于*/
	createDate_Lte?: number;
	/*配置时间 大于*/
	createDate_Gt?: number;
	/*配置时间 大于等于*/
	createDate_Gte?: number;
	/*配置时间*/
	createDate?: number;
	AND?: SystemInputWhere[];
	OR?: SystemInputWhere[];
	NOT?: SystemInputWhere[];
}
export interface SystemEventInputWhere {
	/**/
	id_Not?: number;
	/**/
	id_In?: number[];
	/**/
	id_NotIn?: number[];
	/**/
	id_Lt?: number;
	/**/
	id_Lte?: number;
	/**/
	id_Gt?: number;
	/**/
	id_Gte?: number;
	id?: number;
	/*权限名 不等于*/
	title_Not?: string;
	/*权限名 在制定内，如[1,2]*/
	title_In?: string[];
	/*权限名 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*权限名 小于*/
	title_Lt?: string;
	/*权限名 小于等于*/
	title_Lte?: string;
	/*权限名 大于*/
	title_Gt?: string;
	/*权限名 大于等于*/
	title_Gte?: string;
	/*权限名 包含*/
	title_Contains?: string;
	/*权限名 不包含*/
	title_NotContains?: string;
	/*权限名 开头等于*/
	title_StartsWith?: string;
	/*权限名 开头不等于*/
	title_NotStartsWith?: string;
	/*权限名 结尾等于*/
	title_EndsWith?: string;
	/*权限名 结尾不等于*/
	title_NotEndsWith?: string;
	/*权限名*/
	title?: string;
	AND?: SystemEventInputWhere[];
	OR?: SystemEventInputWhere[];
	NOT?: SystemEventInputWhere[];
}
export interface SystemRightInputWhere {
	/**/
	id_Not?: number;
	/**/
	id_In?: number[];
	/**/
	id_NotIn?: number[];
	/**/
	id_Lt?: number;
	/**/
	id_Lte?: number;
	/**/
	id_Gt?: number;
	/**/
	id_Gte?: number;
	id?: number;
	/*权限类型
页面权限、数据权限、功能权限 不等于*/
	type_Not?: string;
	/*权限类型
页面权限、数据权限、功能权限 在制定内，如[1,2]*/
	type_In?: string[];
	/*权限类型
页面权限、数据权限、功能权限 不在制定内,如[1,2]*/
	type_NotIn?: string[];
	/*权限类型
页面权限、数据权限、功能权限 小于*/
	type_Lt?: string;
	/*权限类型
页面权限、数据权限、功能权限 小于等于*/
	type_Lte?: string;
	/*权限类型
页面权限、数据权限、功能权限 大于*/
	type_Gt?: string;
	/*权限类型
页面权限、数据权限、功能权限 大于等于*/
	type_Gte?: string;
	/*权限类型
页面权限、数据权限、功能权限 包含*/
	type_Contains?: string;
	/*权限类型
页面权限、数据权限、功能权限 不包含*/
	type_NotContains?: string;
	/*权限类型
页面权限、数据权限、功能权限 开头等于*/
	type_StartsWith?: string;
	/*权限类型
页面权限、数据权限、功能权限 开头不等于*/
	type_NotStartsWith?: string;
	/*权限类型
页面权限、数据权限、功能权限 结尾等于*/
	type_EndsWith?: string;
	/*权限类型
页面权限、数据权限、功能权限 结尾不等于*/
	type_NotEndsWith?: string;
	/*权限类型
页面权限、数据权限、功能权限*/
	type?: string;
	/*权限名 不等于*/
	title_Not?: string;
	/*权限名 在制定内，如[1,2]*/
	title_In?: string[];
	/*权限名 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*权限名 小于*/
	title_Lt?: string;
	/*权限名 小于等于*/
	title_Lte?: string;
	/*权限名 大于*/
	title_Gt?: string;
	/*权限名 大于等于*/
	title_Gte?: string;
	/*权限名 包含*/
	title_Contains?: string;
	/*权限名 不包含*/
	title_NotContains?: string;
	/*权限名 开头等于*/
	title_StartsWith?: string;
	/*权限名 开头不等于*/
	title_NotStartsWith?: string;
	/*权限名 结尾等于*/
	title_EndsWith?: string;
	/*权限名 结尾不等于*/
	title_NotEndsWith?: string;
	/*权限名*/
	title?: string;
	/*命名空间 不等于*/
	namespace_Not?: string;
	/*命名空间 在制定内，如[1,2]*/
	namespace_In?: string[];
	/*命名空间 不在制定内,如[1,2]*/
	namespace_NotIn?: string[];
	/*命名空间 小于*/
	namespace_Lt?: string;
	/*命名空间 小于等于*/
	namespace_Lte?: string;
	/*命名空间 大于*/
	namespace_Gt?: string;
	/*命名空间 大于等于*/
	namespace_Gte?: string;
	/*命名空间 包含*/
	namespace_Contains?: string;
	/*命名空间 不包含*/
	namespace_NotContains?: string;
	/*命名空间 开头等于*/
	namespace_StartsWith?: string;
	/*命名空间 开头不等于*/
	namespace_NotStartsWith?: string;
	/*命名空间 结尾等于*/
	namespace_EndsWith?: string;
	/*命名空间 结尾不等于*/
	namespace_NotEndsWith?: string;
	/*命名空间*/
	namespace?: string;
	/*权限代号 不等于*/
	code_Not?: string;
	/*权限代号 在制定内，如[1,2]*/
	code_In?: string[];
	/*权限代号 不在制定内,如[1,2]*/
	code_NotIn?: string[];
	/*权限代号 小于*/
	code_Lt?: string;
	/*权限代号 小于等于*/
	code_Lte?: string;
	/*权限代号 大于*/
	code_Gt?: string;
	/*权限代号 大于等于*/
	code_Gte?: string;
	/*权限代号 包含*/
	code_Contains?: string;
	/*权限代号 不包含*/
	code_NotContains?: string;
	/*权限代号 开头等于*/
	code_StartsWith?: string;
	/*权限代号 开头不等于*/
	code_NotStartsWith?: string;
	/*权限代号 结尾等于*/
	code_EndsWith?: string;
	/*权限代号 结尾不等于*/
	code_NotEndsWith?: string;
	/*权限代号*/
	code?: string;
	/*权限链接 不等于*/
	link_Not?: string;
	/*权限链接 在制定内，如[1,2]*/
	link_In?: string[];
	/*权限链接 不在制定内,如[1,2]*/
	link_NotIn?: string[];
	/*权限链接 小于*/
	link_Lt?: string;
	/*权限链接 小于等于*/
	link_Lte?: string;
	/*权限链接 大于*/
	link_Gt?: string;
	/*权限链接 大于等于*/
	link_Gte?: string;
	/*权限链接 包含*/
	link_Contains?: string;
	/*权限链接 不包含*/
	link_NotContains?: string;
	/*权限链接 开头等于*/
	link_StartsWith?: string;
	/*权限链接 开头不等于*/
	link_NotStartsWith?: string;
	/*权限链接 结尾等于*/
	link_EndsWith?: string;
	/*权限链接 结尾不等于*/
	link_NotEndsWith?: string;
	/*权限链接*/
	link?: string;
	AND?: SystemRightInputWhere[];
	OR?: SystemRightInputWhere[];
	NOT?: SystemRightInputWhere[];
}
export interface DepartmentInputWhere {
	/*部门编号 不等于*/
	id_Not?: number;
	/*部门编号 在制定内，如[1,2]*/
	id_In?: number[];
	/*部门编号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*部门编号 小于*/
	id_Lt?: number;
	/*部门编号 小于等于*/
	id_Lte?: number;
	/*部门编号 大于*/
	id_Gt?: number;
	/*部门编号 大于等于*/
	id_Gte?: number;
	/*部门编号*/
	id?: number;
	/*部门名称 不等于*/
	title_Not?: string;
	/*部门名称 在制定内，如[1,2]*/
	title_In?: string[];
	/*部门名称 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*部门名称 小于*/
	title_Lt?: string;
	/*部门名称 小于等于*/
	title_Lte?: string;
	/*部门名称 大于*/
	title_Gt?: string;
	/*部门名称 大于等于*/
	title_Gte?: string;
	/*部门名称 包含*/
	title_Contains?: string;
	/*部门名称 不包含*/
	title_NotContains?: string;
	/*部门名称 开头等于*/
	title_StartsWith?: string;
	/*部门名称 开头不等于*/
	title_NotStartsWith?: string;
	/*部门名称 结尾等于*/
	title_EndsWith?: string;
	/*部门名称 结尾不等于*/
	title_NotEndsWith?: string;
	/*部门名称*/
	title?: string;
	/*部门状态 不等于*/
	status_Not?: number;
	/*部门状态 在制定内，如[1,2]*/
	status_In?: number[];
	/*部门状态 不在制定内,如[1,2]*/
	status_NotIn?: number[];
	/*部门状态 小于*/
	status_Lt?: number;
	/*部门状态 小于等于*/
	status_Lte?: number;
	/*部门状态 大于*/
	status_Gt?: number;
	/*部门状态 大于等于*/
	status_Gte?: number;
	/*部门状态*/
	status?: number;
	/*创建时间 不等于*/
	createDate_Not?: number;
	/*创建时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*创建时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*创建时间 小于*/
	createDate_Lt?: number;
	/*创建时间 小于等于*/
	createDate_Lte?: number;
	/*创建时间 大于*/
	createDate_Gt?: number;
	/*创建时间 大于等于*/
	createDate_Gte?: number;
	/*创建时间*/
	createDate?: number;
	/**/
	domainId_Not?: number;
	/**/
	domainId_In?: number[];
	/**/
	domainId_NotIn?: number[];
	/**/
	domainId_Lt?: number;
	/**/
	domainId_Lte?: number;
	/**/
	domainId_Gt?: number;
	/**/
	domainId_Gte?: number;
	domainId?: number;
	AND?: DepartmentInputWhere[];
	OR?: DepartmentInputWhere[];
	NOT?: DepartmentInputWhere[];
}
export interface RoleInputWhere {
	/*序号 不等于*/
	id_Not?: number;
	/*序号 在制定内，如[1,2]*/
	id_In?: number[];
	/*序号 不在制定内,如[1,2]*/
	id_NotIn?: number[];
	/*序号 小于*/
	id_Lt?: number;
	/*序号 小于等于*/
	id_Lte?: number;
	/*序号 大于*/
	id_Gt?: number;
	/*序号 大于等于*/
	id_Gte?: number;
	/*序号*/
	id?: number;
	/*角色标识 不等于*/
	code_Not?: string;
	/*角色标识 在制定内，如[1,2]*/
	code_In?: string[];
	/*角色标识 不在制定内,如[1,2]*/
	code_NotIn?: string[];
	/*角色标识 小于*/
	code_Lt?: string;
	/*角色标识 小于等于*/
	code_Lte?: string;
	/*角色标识 大于*/
	code_Gt?: string;
	/*角色标识 大于等于*/
	code_Gte?: string;
	/*角色标识 包含*/
	code_Contains?: string;
	/*角色标识 不包含*/
	code_NotContains?: string;
	/*角色标识 开头等于*/
	code_StartsWith?: string;
	/*角色标识 开头不等于*/
	code_NotStartsWith?: string;
	/*角色标识 结尾等于*/
	code_EndsWith?: string;
	/*角色标识 结尾不等于*/
	code_NotEndsWith?: string;
	/*角色标识*/
	code?: string;
	/*角色名称 不等于*/
	title_Not?: string;
	/*角色名称 在制定内，如[1,2]*/
	title_In?: string[];
	/*角色名称 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*角色名称 小于*/
	title_Lt?: string;
	/*角色名称 小于等于*/
	title_Lte?: string;
	/*角色名称 大于*/
	title_Gt?: string;
	/*角色名称 大于等于*/
	title_Gte?: string;
	/*角色名称 包含*/
	title_Contains?: string;
	/*角色名称 不包含*/
	title_NotContains?: string;
	/*角色名称 开头等于*/
	title_StartsWith?: string;
	/*角色名称 开头不等于*/
	title_NotStartsWith?: string;
	/*角色名称 结尾等于*/
	title_EndsWith?: string;
	/*角色名称 结尾不等于*/
	title_NotEndsWith?: string;
	/*角色名称*/
	title?: string;
	/*角色描述 不等于*/
	desc_Not?: string;
	/*角色描述 在制定内，如[1,2]*/
	desc_In?: string[];
	/*角色描述 不在制定内,如[1,2]*/
	desc_NotIn?: string[];
	/*角色描述 小于*/
	desc_Lt?: string;
	/*角色描述 小于等于*/
	desc_Lte?: string;
	/*角色描述 大于*/
	desc_Gt?: string;
	/*角色描述 大于等于*/
	desc_Gte?: string;
	/*角色描述 包含*/
	desc_Contains?: string;
	/*角色描述 不包含*/
	desc_NotContains?: string;
	/*角色描述 开头等于*/
	desc_StartsWith?: string;
	/*角色描述 开头不等于*/
	desc_NotStartsWith?: string;
	/*角色描述 结尾等于*/
	desc_EndsWith?: string;
	/*角色描述 结尾不等于*/
	desc_NotEndsWith?: string;
	/*角色描述*/
	desc?: string;
	/*创建时间 不等于*/
	createDate_Not?: number;
	/*创建时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*创建时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*创建时间 小于*/
	createDate_Lt?: number;
	/*创建时间 小于等于*/
	createDate_Lte?: number;
	/*创建时间 大于*/
	createDate_Gt?: number;
	/*创建时间 大于等于*/
	createDate_Gte?: number;
	/*创建时间*/
	createDate?: number;
	/*更新时间 不等于*/
	updateDate_Not?: number;
	/*更新时间 在制定内，如[1,2]*/
	updateDate_In?: number[];
	/*更新时间 不在制定内,如[1,2]*/
	updateDate_NotIn?: number[];
	/*更新时间 小于*/
	updateDate_Lt?: number;
	/*更新时间 小于等于*/
	updateDate_Lte?: number;
	/*更新时间 大于*/
	updateDate_Gt?: number;
	/*更新时间 大于等于*/
	updateDate_Gte?: number;
	/*更新时间*/
	updateDate?: number;
	AND?: RoleInputWhere[];
	OR?: RoleInputWhere[];
	NOT?: RoleInputWhere[];
}
export interface RoleGroupInputWhere {
	/**/
	id_Not?: number;
	/**/
	id_In?: number[];
	/**/
	id_NotIn?: number[];
	/**/
	id_Lt?: number;
	/**/
	id_Lte?: number;
	/**/
	id_Gt?: number;
	/**/
	id_Gte?: number;
	id?: number;
	/*角色组名 不等于*/
	title_Not?: string;
	/*角色组名 在制定内，如[1,2]*/
	title_In?: string[];
	/*角色组名 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*角色组名 小于*/
	title_Lt?: string;
	/*角色组名 小于等于*/
	title_Lte?: string;
	/*角色组名 大于*/
	title_Gt?: string;
	/*角色组名 大于等于*/
	title_Gte?: string;
	/*角色组名 包含*/
	title_Contains?: string;
	/*角色组名 不包含*/
	title_NotContains?: string;
	/*角色组名 开头等于*/
	title_StartsWith?: string;
	/*角色组名 开头不等于*/
	title_NotStartsWith?: string;
	/*角色组名 结尾等于*/
	title_EndsWith?: string;
	/*角色组名 结尾不等于*/
	title_NotEndsWith?: string;
	/*角色组名*/
	title?: string;
	/*角色组简介 不等于*/
	desc_Not?: string;
	/*角色组简介 在制定内，如[1,2]*/
	desc_In?: string[];
	/*角色组简介 不在制定内,如[1,2]*/
	desc_NotIn?: string[];
	/*角色组简介 小于*/
	desc_Lt?: string;
	/*角色组简介 小于等于*/
	desc_Lte?: string;
	/*角色组简介 大于*/
	desc_Gt?: string;
	/*角色组简介 大于等于*/
	desc_Gte?: string;
	/*角色组简介 包含*/
	desc_Contains?: string;
	/*角色组简介 不包含*/
	desc_NotContains?: string;
	/*角色组简介 开头等于*/
	desc_StartsWith?: string;
	/*角色组简介 开头不等于*/
	desc_NotStartsWith?: string;
	/*角色组简介 结尾等于*/
	desc_EndsWith?: string;
	/*角色组简介 结尾不等于*/
	desc_NotEndsWith?: string;
	/*角色组简介*/
	desc?: string;
	AND?: RoleGroupInputWhere[];
	OR?: RoleGroupInputWhere[];
	NOT?: RoleGroupInputWhere[];
}
export interface SafetyScoreRuleInputWhere {
	/**/
	id_Not?: number;
	/**/
	id_In?: number[];
	/**/
	id_NotIn?: number[];
	/**/
	id_Lt?: number;
	/**/
	id_Lte?: number;
	/**/
	id_Gt?: number;
	/**/
	id_Gte?: number;
	id?: number;
	/*规则名 不等于*/
	title_Not?: string;
	/*规则名 在制定内，如[1,2]*/
	title_In?: string[];
	/*规则名 不在制定内,如[1,2]*/
	title_NotIn?: string[];
	/*规则名 小于*/
	title_Lt?: string;
	/*规则名 小于等于*/
	title_Lte?: string;
	/*规则名 大于*/
	title_Gt?: string;
	/*规则名 大于等于*/
	title_Gte?: string;
	/*规则名 包含*/
	title_Contains?: string;
	/*规则名 不包含*/
	title_NotContains?: string;
	/*规则名 开头等于*/
	title_StartsWith?: string;
	/*规则名 开头不等于*/
	title_NotStartsWith?: string;
	/*规则名 结尾等于*/
	title_EndsWith?: string;
	/*规则名 结尾不等于*/
	title_NotEndsWith?: string;
	/*规则名*/
	title?: string;
	/*代号 不等于*/
	code_Not?: string;
	/*代号 在制定内，如[1,2]*/
	code_In?: string[];
	/*代号 不在制定内,如[1,2]*/
	code_NotIn?: string[];
	/*代号 小于*/
	code_Lt?: string;
	/*代号 小于等于*/
	code_Lte?: string;
	/*代号 大于*/
	code_Gt?: string;
	/*代号 大于等于*/
	code_Gte?: string;
	/*代号 包含*/
	code_Contains?: string;
	/*代号 不包含*/
	code_NotContains?: string;
	/*代号 开头等于*/
	code_StartsWith?: string;
	/*代号 开头不等于*/
	code_NotStartsWith?: string;
	/*代号 结尾等于*/
	code_EndsWith?: string;
	/*代号 结尾不等于*/
	code_NotEndsWith?: string;
	/*代号*/
	code?: string;
	/*分值 不等于*/
	score_Not?: number;
	/*分值 在制定内，如[1,2]*/
	score_In?: number[];
	/*分值 不在制定内,如[1,2]*/
	score_NotIn?: number[];
	/*分值 小于*/
	score_Lt?: number;
	/*分值 小于等于*/
	score_Lte?: number;
	/*分值 大于*/
	score_Gt?: number;
	/*分值 大于等于*/
	score_Gte?: number;
	/*分值*/
	score?: number;
	/*时间 不等于*/
	createDate_Not?: number;
	/*时间 在制定内，如[1,2]*/
	createDate_In?: number[];
	/*时间 不在制定内,如[1,2]*/
	createDate_NotIn?: number[];
	/*时间 小于*/
	createDate_Lt?: number;
	/*时间 小于等于*/
	createDate_Lte?: number;
	/*时间 大于*/
	createDate_Gt?: number;
	/*时间 大于等于*/
	createDate_Gte?: number;
	/*时间*/
	createDate?: number;
	AND?: SafetyScoreRuleInputWhere[];
	OR?: SafetyScoreRuleInputWhere[];
	NOT?: SafetyScoreRuleInputWhere[];
}
export interface UserInputOrder {
	/*用户编号
排序可选值为ASC或者DESC*/
	id?: string;
	/*用户名
排序可选值为ASC或者DESC*/
	username?: string;
	/*邮箱
排序可选值为ASC或者DESC*/
	email?: string;
	/*头像
排序可选值为ASC或者DESC*/
	avatar?: string;
	/*电话号码
排序可选值为ASC或者DESC*/
	mobile?: string;
	/*密码
排序可选值为ASC或者DESC*/
	password?: string;
	/*1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封
排序可选值为ASC或者DESC*/
	status?: string;
	/*随机码
排序可选值为ASC或者DESC*/
	randomCode?: string;
	/*密码是否被重置
排序可选值为ASC或者DESC*/
	isRestPassword?: string;
	/*密码更改时间
排序可选值为ASC或者DESC*/
	passwordDate?: string;
	/*创建时间
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*这个用户的创建人是谁
排序可选值为ASC或者DESC*/
	createUser?: string;
	/*创建人的uid
排序可选值为ASC或者DESC*/
	createUserId?: string;
	createUsers?: string;
	/*安全分
排序可选值为ASC或者DESC*/
	safetyScore?: string;
	/*用户的代办事项
排序可选值为ASC或者DESC*/
	toDoItems?: string;
	/*发布者
排序可选值为ASC或者DESC*/
	mineToDoItems?: string;
	/*用户岗位
排序可选值为ASC或者DESC*/
	stations?: string;
	/*用户的登录记录
排序可选值为ASC或者DESC*/
	loginLogs?: string;
	/*用户的安全分扣分记录
排序可选值为ASC或者DESC*/
	safetyScoreLogs?: string;
	createStations?: string;
}
export interface SystemInputOrder {
	id?: string;
	/*模块名
排序可选值为ASC或者DESC*/
	title?: string;
	/*系统缩略图片
排序可选值为ASC或者DESC*/
	image?: string;
	/*首页链接
排序可选值为ASC或者DESC*/
	link?: string;
	/*模块代号
排序可选值为ASC或者DESC*/
	code?: string;
	/*模块权限
排序可选值为ASC或者DESC*/
	rights?: string;
	/*模块事件
排序可选值为ASC或者DESC*/
	events?: string;
	/*代办事项
排序可选值为ASC或者DESC*/
	toDoItems?: string;
	/*配置时间
排序可选值为ASC或者DESC*/
	createDate?: string;
}
export interface SystemEventInputOrder {
	id?: string;
	/*权限名
排序可选值为ASC或者DESC*/
	title?: string;
	/*来源模块
排序可选值为ASC或者DESC*/
	fromSystem?: string;
	/*代办事项
排序可选值为ASC或者DESC*/
	toDoItems?: string;
}
export interface SystemRightInputOrder {
	id?: string;
	/*权限类型
页面权限、数据权限、功能权限
排序可选值为ASC或者DESC*/
	type?: string;
	/*权限名
排序可选值为ASC或者DESC*/
	title?: string;
	/*命名空间
排序可选值为ASC或者DESC*/
	namespace?: string;
	/*权限代号
排序可选值为ASC或者DESC*/
	code?: string;
	/*权限链接
排序可选值为ASC或者DESC*/
	link?: string;
	/*来源模块
排序可选值为ASC或者DESC*/
	fromSystem?: string;
	/*可用角色
排序可选值为ASC或者DESC*/
	toRoles?: string;
}
export interface DepartmentInputOrder {
	/*部门编号
排序可选值为ASC或者DESC*/
	id?: string;
	/*部门名称
排序可选值为ASC或者DESC*/
	title?: string;
	/*部门状态
排序可选值为ASC或者DESC*/
	status?: string;
	/*是否显示
排序可选值为ASC或者DESC*/
	shown?: string;
	/*上级部门
排序可选值为ASC或者DESC*/
	parent?: string;
	/*创建时间
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*下级部门
排序可选值为ASC或者DESC*/
	children?: string;
	/*一个部门可以有多个岗位
排序可选值为ASC或者DESC*/
	stations?: string;
	/*域
排序可选值为ASC或者DESC*/
	domain?: string;
	domainId?: string;
}
export interface RoleInputOrder {
	/*序号
排序可选值为ASC或者DESC*/
	id?: string;
	/*角色标识
排序可选值为ASC或者DESC*/
	code?: string;
	/*角色名称
排序可选值为ASC或者DESC*/
	title?: string;
	/*角色描述
排序可选值为ASC或者DESC*/
	desc?: string;
	/*一个角色可以有多个权限
排序可选值为ASC或者DESC*/
	rights?: string;
	/*一个角色 可以使用某个岗位的职员
排序可选值为ASC或者DESC*/
	canUseStations?: string;
	/*创建时间
排序可选值为ASC或者DESC*/
	createDate?: string;
	/*更新时间
排序可选值为ASC或者DESC*/
	updateDate?: string;
	/*一个角色 被那几个角色组使用
排序可选值为ASC或者DESC*/
	group?: string;
}
export interface RoleGroupInputOrder {
	id?: string;
	/*角色组名
排序可选值为ASC或者DESC*/
	title?: string;
	/*角色组简介
排序可选值为ASC或者DESC*/
	desc?: string;
	/*拥有角色
排序可选值为ASC或者DESC*/
	roles?: string;
	/*用到此角色组的岗位
排序可选值为ASC或者DESC*/
	stations?: string;
}
export interface SafetyScoreRuleInputOrder {
	id?: string;
	/*规则名
排序可选值为ASC或者DESC*/
	title?: string;
	/*代号
排序可选值为ASC或者DESC*/
	code?: string;
	/*分值
排序可选值为ASC或者DESC*/
	score?: string;
	/*是否替换
排序可选值为ASC或者DESC*/
	isReplace?: string;
	/*记录
排序可选值为ASC或者DESC*/
	logs?: string;
	/*时间
排序可选值为ASC或者DESC*/
	createDate?: string;
}
export interface Query {
	/*通过指定条件获取一条数据*/
	getUser<T>(/*条件*/entity: UserInputWhere, __selection?: string): Promise<T & User>;
	/*通过指定条件获取一条数据*/
	getSystem<T>(/*条件*/entity: SystemInputWhere, __selection?: string): Promise<T & System>;
	/*通过指定条件获取一条数据*/
	getSystemEvent<T>(/*条件*/entity: SystemEventInputWhere, __selection?: string): Promise<T & SystemEvent>;
	/*通过指定条件获取一条数据*/
	getSystemRight<T>(/*条件*/entity: SystemRightInputWhere, __selection?: string): Promise<T & SystemRight>;
	/*通过指定条件获取一条数据*/
	getDepartment<T>(/*条件*/entity: DepartmentInputWhere, __selection?: string): Promise<T & Department>;
	/*通过指定条件获取一条数据*/
	getRole<T>(/*条件*/entity: RoleInputWhere, __selection?: string): Promise<T & Role>;
	/*通过指定条件获取一条数据*/
	getStation<T>(/*条件*/entity: StationInputWhere, __selection?: string): Promise<T & Station>;
	/*通过指定条件获取一条数据*/
	getToDoItem<T>(/*条件*/entity: ToDoItemInputWhere, __selection?: string): Promise<T & ToDoItem>;
	/*通过指定条件获取一条数据*/
	getRoleGroup<T>(/*条件*/entity: RoleGroupInputWhere, __selection?: string): Promise<T & RoleGroup>;
	/*通过指定条件获取一条数据*/
	getUserLoginLog<T>(/*条件*/entity: UserLoginLogInputWhere, __selection?: string): Promise<T & UserLoginLog>;
	/*通过指定条件获取一条数据*/
	getSafetyScoreLog<T>(/*条件*/entity: SafetyScoreLogInputWhere, __selection?: string): Promise<T & SafetyScoreLog>;
	/*通过指定条件获取一条数据*/
	getSafetyScoreRule<T>(/*条件*/entity: SafetyScoreRuleInputWhere, __selection?: string): Promise<T & SafetyScoreRule>;
	/*通过制定条件获取一组数据*/
	findUser<T>(/*条件*/entity: UserInputWhere, order: UserInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & User[]>;
	/*通过制定条件获取一组数据*/
	findSystem<T>(/*条件*/entity: SystemInputWhere, order: SystemInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & System[]>;
	/*通过制定条件获取一组数据*/
	findSystemEvent<T>(/*条件*/entity: SystemEventInputWhere, order: SystemEventInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & SystemEvent[]>;
	/*通过制定条件获取一组数据*/
	findSystemRight<T>(/*条件*/entity: SystemRightInputWhere, order: SystemRightInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & SystemRight[]>;
	/*通过制定条件获取一组数据*/
	findDepartment<T>(/*条件*/entity: DepartmentInputWhere, order: DepartmentInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & Department[]>;
	/*通过制定条件获取一组数据*/
	findRole<T>(/*条件*/entity: RoleInputWhere, order: RoleInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & Role[]>;
	/*通过制定条件获取一组数据*/
	findStation<T>(/*条件*/entity: StationInputWhere, order: StationInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & Station[]>;
	/*通过制定条件获取一组数据*/
	findToDoItem<T>(/*条件*/entity: ToDoItemInputWhere, order: ToDoItemInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & ToDoItem[]>;
	/*通过制定条件获取一组数据*/
	findRoleGroup<T>(/*条件*/entity: RoleGroupInputWhere, order: RoleGroupInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & RoleGroup[]>;
	/*通过制定条件获取一组数据*/
	findUserLoginLog<T>(/*条件*/entity: UserLoginLogInputWhere, order: UserLoginLogInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & UserLoginLog[]>;
	/*通过制定条件获取一组数据*/
	findSafetyScoreLog<T>(/*条件*/entity: SafetyScoreLogInputWhere, order: SafetyScoreLogInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & SafetyScoreLog[]>;
	/*通过制定条件获取一组数据*/
	findSafetyScoreRule<T>(/*条件*/entity: SafetyScoreRuleInputWhere, order: SafetyScoreRuleInputOrder, limit?: PageLimitInput, __selection?: string): Promise<T & SafetyScoreRule[]>;
	/*删除*/
	deleteUser<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteSystem<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteSystemEvent<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteSystemRight<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteDepartment<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteRole<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteStation<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteToDoItem<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteRoleGroup<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteUserLoginLog<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteSafetyScoreLog<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
	/*删除*/
	deleteSafetyScoreRule<T>(/*根据id删除*/id: number, __selection?: string): Promise<T & boolean>;
}
export interface Mutation {
	/*没有就插入，有就更新*/
	saveUser<T>(/*要保存的数据*/entity: UserInput, __selection?: string): Promise<T & User>;
	/*没有就插入，有就更新*/
	saveSystem<T>(/*要保存的数据*/entity: SystemInput, __selection?: string): Promise<T & System>;
	/*没有就插入，有就更新*/
	saveSystemEvent<T>(/*要保存的数据*/entity: SystemEventInput, __selection?: string): Promise<T & SystemEvent>;
	/*没有就插入，有就更新*/
	saveSystemRight<T>(/*要保存的数据*/entity: SystemRightInput, __selection?: string): Promise<T & SystemRight>;
	/*没有就插入，有就更新*/
	saveDepartment<T>(/*要保存的数据*/entity: DepartmentInput, __selection?: string): Promise<T & Department>;
	/*没有就插入，有就更新*/
	saveRole<T>(/*要保存的数据*/entity: RoleInput, __selection?: string): Promise<T & Role>;
	/*没有就插入，有就更新*/
	saveStation<T>(/*要保存的数据*/entity: StationInput, __selection?: string): Promise<T & Station>;
	/*没有就插入，有就更新*/
	saveToDoItem<T>(/*要保存的数据*/entity: ToDoItemInput, __selection?: string): Promise<T & ToDoItem>;
	/*没有就插入，有就更新*/
	saveRoleGroup<T>(/*要保存的数据*/entity: RoleGroupInput, __selection?: string): Promise<T & RoleGroup>;
	/*没有就插入，有就更新*/
	saveUserLoginLog<T>(/*要保存的数据*/entity: UserLoginLogInput, __selection?: string): Promise<T & UserLoginLog>;
	/*没有就插入，有就更新*/
	saveSafetyScoreLog<T>(/*要保存的数据*/entity: SafetyScoreLogInput, __selection?: string): Promise<T & SafetyScoreLog>;
	/*没有就插入，有就更新*/
	saveSafetyScoreRule<T>(/*要保存的数据*/entity: SafetyScoreRuleInput, __selection?: string): Promise<T & SafetyScoreRule>;
	/*插入数据*/
	insertUser<T>(/*要插入的数据*/entity: UserInput, __selection?: string): Promise<T & User>;
	/*插入数据*/
	insertSystem<T>(/*要插入的数据*/entity: SystemInput, __selection?: string): Promise<T & System>;
	/*插入数据*/
	insertSystemEvent<T>(/*要插入的数据*/entity: SystemEventInput, __selection?: string): Promise<T & SystemEvent>;
	/*插入数据*/
	insertSystemRight<T>(/*要插入的数据*/entity: SystemRightInput, __selection?: string): Promise<T & SystemRight>;
	/*插入数据*/
	insertDepartment<T>(/*要插入的数据*/entity: DepartmentInput, __selection?: string): Promise<T & Department>;
	/*插入数据*/
	insertRole<T>(/*要插入的数据*/entity: RoleInput, __selection?: string): Promise<T & Role>;
	/*插入数据*/
	insertStation<T>(/*要插入的数据*/entity: StationInput, __selection?: string): Promise<T & Station>;
	/*插入数据*/
	insertToDoItem<T>(/*要插入的数据*/entity: ToDoItemInput, __selection?: string): Promise<T & ToDoItem>;
	/*插入数据*/
	insertRoleGroup<T>(/*要插入的数据*/entity: RoleGroupInput, __selection?: string): Promise<T & RoleGroup>;
	/*插入数据*/
	insertUserLoginLog<T>(/*要插入的数据*/entity: UserLoginLogInput, __selection?: string): Promise<T & UserLoginLog>;
	/*插入数据*/
	insertSafetyScoreLog<T>(/*要插入的数据*/entity: SafetyScoreLogInput, __selection?: string): Promise<T & SafetyScoreLog>;
	/*插入数据*/
	insertSafetyScoreRule<T>(/*要插入的数据*/entity: SafetyScoreRuleInput, __selection?: string): Promise<T & SafetyScoreRule>;
}