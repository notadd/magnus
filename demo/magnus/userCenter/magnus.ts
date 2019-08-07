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

export interface User {
	/*用户id*/
	id: number;
	/*用户名*/
	username: string;
	/*用户状态 0未绑定，1正常，-1刚解锁，-2被锁定*/
	status: number;
	/*随机码*/
	randomCode: string;
	/*是否重置密码*/
	isRestPassword: boolean;
	/*安全分*/
	safetyScore: number;
}
export interface GetUserByUserNameResult {
	/*404 没有找到
200 成功*/
	code: string;
	data?: User;
}
export interface GetUserByUserNameInput {
/*用户名*/	username: string;
}
export interface VerifyUsernameAndPasswordAreCorrectResult {
	/*是否验证通过*/
	ok: boolean;
	/*JsonWebToken*/
	jsonWebToken?: string;
}
export interface VerifyUsernameAndPasswordAreCorrectInput {
/*用户名*/	username: string;
/*密码*/	password: string;
}
/*返回的参数*/
export interface FindStationData {
	/*序号*/
	id: number;
	/*岗位名称*/
	positionTitle: string;
	/*岗位编号*/
	jobNumber: string;
	/*岗位描述*/
	jobDescription: string;
	/*拥有角色*/
	haveRole: string[];
	/*创建人*/
	createUserName: string;
	/*创建时间*/
	createDate: string;
}
/*FindStation返回结果*/
export interface FindStationResult {
	/*200 查询成功*/
	code: number;
	message: string;
	data?: FindStationData[];
}
export interface FindStationInput {
/*页码*/	page: number;
/*每页数量*/	psize: number;
/*岗位名称*/	positionTitle: string;
/*创建人*/	createUserUsername: string;
/*创建时间 开始and结束*/	createDate: Empty;
}
export interface DeleteStationResult {
	/*200为删除成功 -200 删除失败*/
	code: number;
	/*删除成功 or 删除失败*/
	message: string;
}
export interface DeleteStationInput {
/*岗位id*/	id: number;
}
/*禁用岗位返回参数*/
export interface ForbidStationResult {
	/*200禁用成功 -200禁用失败*/
	code: number;
	/*禁用成功 or 禁用失败*/
	message: string;
}
export interface ForbidStationInput {
	id: number;
}
/*GetStation的岗位信息*/
export interface GetStationData {
	/*部门*/
	department: string;
	/*岗位编号*/
	jobNumber: string;
	/*岗位名称*/
	positionTitle: string;
	/*岗位描述*/
	jobDescription: string;
	/*岗位职责*/
	jobResponsibilities: string;
	/*岗位要求*/
	jobRequirements: string;
	/*角色组*/
	roleGroup: string;
	/*状态*/
	status: number;
}
/*根据id获取岗位get*/
export interface GetStationResult {
	/*200 获取成功, -200未查询到该岗位*/
	code: number;
	message: string;
	data?: GetStationData;
}
export interface GetStationInput {
	id: number;
}
/*获取所有岗位得数据*/
export interface GetAllStationData {
	id: number;
	title: string;
}
/*通过部门获取所有岗位返回的结果*/
export interface GetAllStationByDepartmentResult {
	code: number;
	message: string;
	data?: GetAllStationData[];
}
export interface GetAllStationByDepartmentInput {
	departmentId: number;
}
/*获取所有用户的数据*/
export interface GetAllUserData {
	/*用户名*/
	title: string;
	/*用户id*/
	id: string;
}
/*通过岗位获取所有用户返回的结果*/
export interface GetAllUserByStationResult {
	code: number;
	message: string;
	data?: GetAllUserData[];
}
export interface GetAllUserByStationInput {
	stationId: number;
}
export interface SaveUserData {
	id: number;
	username: string;
	phoneNumber: string;
	email: string;
	renGang: string[];
	bindingStaff: string;
}
export interface SaveUserResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
	/*返回数据*/
	data?: SaveUserData;
}
export interface SaveUserInput {
/*用户id*/	id: number;
/*用户名称*/	username: string;
/*电话号码*/	phoneNumber: string;
/*电子邮箱*/	email: string;
/*任岗*/	renGang: number[];
/*绑定人员*/	bindingStaff: number;
}
export interface DeleteUserResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
}
export interface DeleteUserInput {
/*用户id*/	uid: number;
}
export interface FindUserData {
	/*序号*/
	id: number;
	/*用户名*/
	username: string;
	/*手机号*/
	mobile: string;
	/*部门名称*/
	departmentTitle: string;
	/*角色*/
	roles: string[];
	/*状态*/
	status: number;
	/*创建时间*/
	createDate: number;
	/*创建人*/
	createUserName: string;
}
export interface FindUserResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
	/*返回数据*/
	data?: FindUserData[];
}
export interface FindUserInput {
/*页码*/	page: number;
/*每页数量*/	psize: number;
/*用户名*/	username: string;
/*手机号*/	mobile: string;
/*状态*/	status: number;
/*创建时间  开始and结束*/	createUserId: number;
	departmentId: number;
}
export interface ForbidUserResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
}
export interface ForbidUserInput {
/*用户Id*/	uid: number;
/*用户状态*/	status: number;
}
export interface GetUserResultData {
	/*用户id*/
	id: number;
	/*用户名称*/
	username: string;
	/*电话号码*/
	phoneNumber: string;
	/*电子邮箱*/
	email: string;
	/*任岗*/
	renGang: string[];
	/*绑定人员*/
	bindingStaff: string;
	/*状态*/
	status: number;
	/*创建时间*/
	createDate: string;
	/*创建人*/
	createUserUsername: string;
}
export interface GetUserResult {
	/*返回码*/
	code: number;
	/*返回信息*/
	message: string;
	/*返回数据*/
	data?: GetUserResultData;
}
export interface GetUserInput {
	id: number;
}
export interface UserCenterAuth {
	/*根据用户名获取用户信息*/
	getUserByUserName(/*用户名*/entity: GetUserByUserNameInput): Observable<GetUserByUserNameResult>;
	/*验证用户名密码是否正确*/
	verifyUsernameAndPasswordAreCorrect(/*用户名和密码*/entity: VerifyUsernameAndPasswordAreCorrectInput): Observable<VerifyUsernameAndPasswordAreCorrectResult>;
}
export interface UserCenterStation {
	/*根据查询条件查询符合条件的所有岗位*/
	findStation(/*查询条件*/where: FindStationInput): Observable<FindStationResult>;
	/*根据岗位id删除岗位*/
	deleteStation(/*删除条件,岗位id*/where: DeleteStationInput): Observable<DeleteStationResult>;
	/*根据岗位id禁用岗位*/
	forbidStation(/*禁用条件,岗位id*/where: ForbidStationInput): Observable<ForbidStationResult>;
	/*根据岗位id获取岗位信息*/
	getStation(where: GetStationInput): Observable<GetStationResult>;
	/*根据部门id获取其下所有的岗位*/
	getAllStartionByDepartment(/*部门Id*/where: GetAllStationByDepartmentInput): Observable<GetAllStationByDepartmentResult>;
	/*根据岗位id查询所有的用户*/
	getAllUserByStation(/*查询的参数,岗位的id*/where: GetAllUserByStationInput): Observable<GetAllUserByStationResult>;
}
export interface UserCenterUser {
	/*添加用户:如果id已存在为更新用户,不存在为插入用户*/
	saveUser(/**/user: SaveUserInput): Observable<SaveUserResult>;
	/*删除用户*/
	deleteUser(/**/where: DeleteUserInput): Observable<DeleteUserResult>;
	/*查询所有用户*/
	findUser(/**/entity: FindUserInput): Observable<FindUserResult>;
	/*用户禁用*/
	forbidUser(/**/where: ForbidUserInput): Observable<ForbidUserResult>;
	/*根据Id查询用户详情*/
	getUser(/**/entity: GetUserInput): Observable<GetUserResult>;
}