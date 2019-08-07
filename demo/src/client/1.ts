
import { runner } from '../runner.ts';
import { UserInput } from 'demo/magnus/demo/magnus.server';
interface GetUserResult {
    	getUser: {
	id: number;
	email: string;

};


}
export async function getUser(entity: UserInput): Promise<GetUserResult> {
    const names = ["entity"];
    const args: any = {};
    for (let i = 0; i < arguments.length; i++) {
        args[names[i]] = arguments[i]
    }
    return runner<GetUserResult>(`query getUser($entity: UserInput!) {
  getUser(entity: $entity) {
    id
    email
  }
}
`, args)
}

interface GetStationResult {
    	getStation: {
	id: number;
	title: string;

};


}
export async function getStation(entity: UserInput): Promise<GetStationResult> {
    const names = ["entity"];
    const args: any = {};
    for (let i = 0; i < arguments.length; i++) {
        args[names[i]] = arguments[i]
    }
    return runner<GetStationResult>(`query getStation($entity: UserInput!) {
  getStation(entity: $entity) {
    id
    title
  }
}
`, args)
}
