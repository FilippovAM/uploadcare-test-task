import TasksStore from './TasksStore';
import {API_TASKS_ENDPOINT, API_TASKS_ENDPOINT_V2} from '../constants/api';

const tasksStore = new TasksStore(API_TASKS_ENDPOINT);
/*
* example
*
* create second tasks store with second example api url
* */
const tasksStoreV2 = new TasksStore(API_TASKS_ENDPOINT_V2);

export const stores = {
    tasksStore,
    tasksStoreV2,
};