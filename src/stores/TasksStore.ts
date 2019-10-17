import {action, observable} from 'mobx';

import api, {AxiosResponse} from '../api/api';
import {Status} from '../constants/enums';

const TIMEOUT_FOR_GET_PROGRESS_TASK = 3000; // ms

export interface TaskProps {
    id: string;
    status: Status;
    progress: number | string;
    isUpdating?: boolean;
}

interface CreateTaskResponse {
    id: string;
}

interface UpdateTaskResponse {
    status?: Status;
    progress?: number;
    isUpdating?: boolean;
}

class TasksStore {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    @observable tasks: TaskProps[] = [];
    @observable isLoading: boolean = false; // for create task

    createTask = () => {
        this.setIsLoading(true);

        api.post(`${this.endpoint}/post`)
            .then((res: AxiosResponse<CreateTaskResponse>) => {
                const {id} = res.data;
                this.addTask(id);
            })
            .finally(() => {
                this.setIsLoading(false);
            });
    };

    cancelTask = (id: string) => {
        this.updateTask(id, {isUpdating: true});

        api.delete(`${this.endpoint}/cancel?id=${id}`)
            .then((res: AxiosResponse<UpdateTaskResponse>) => {
                const {status, progress} = res.data;
                this.updateTask(id, {status, progress});
            })
            .finally(() => {
                this.updateTask(id, {isUpdating: false});
            });
    };

    @action
    addTask = (id: string) => {
        this.tasks = [...this.tasks, initTask(id)];
        this.subscribe(id);
    };

    @action
    updateTask = (id: string, params: UpdateTaskResponse) => {
        const task = this.getTask(id);
        if (task) {
            Object.keys(params).forEach((key) => {
                task[key] = params[key];
            });
        }
    };

    subscribe = (id: string) => { // subscribe to progress task
        api.get(`${this.endpoint}/get?id=${id}`)
            .then((res: AxiosResponse<UpdateTaskResponse>) => {
                const {status, progress} = res.data;
                if (status === Status.CANCELED) return;

                this.updateTask(id, {status, progress});

                if (status === Status.PROCESSING) {
                    setTimeout(() => this.subscribe(id), TIMEOUT_FOR_GET_PROGRESS_TASK);
                }
            });
    };

    @action
    setIsLoading = (value: boolean) => {
        this.isLoading = value;
    };

    getTask(id: string): TaskProps | null {
        const tasks = this.tasks.filter(task => task.id === id);
        return tasks && tasks.length ? tasks[0] : null;
    };
}

// region ---- utils
function initTask(id: string) {
    return {
        id,
        status: Status.PROCESSING,
        progress: 0,
    }
}

// ---- endregion≈

export default TasksStore;