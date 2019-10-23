import React from 'react';
import {inject, observer} from 'mobx-react';

import {Button, ButtonType} from '../../components/Button/Button';
import {TaskProps} from '../../stores/TasksStore';
import {Task} from '../../components/Task/Task';
import {Status} from '../../constants/enums';
import {isDef} from '../../utils/utils';

interface InjectedProps {
    tasksStore: {
        tasks: TaskProps[];
        isLoading: boolean;
        createTask: () => void;
        cancelTask: (id: string) => void;
        subscribe: (id: string) => void;
        cancelSubscribe: (id: string) => void;
    };
}

@inject('tasksStore')
@observer
export default class Main extends React.Component {
    static defaultProps = {};

    get injectedProps() {
        return this.props as InjectedProps;
    }

    onClickCreateTask = () => {
        this.injectedProps.tasksStore.createTask();
    };

    onClickCancelTask = (id: string) => {
        return () => {
            this.injectedProps.tasksStore.cancelTask(id);
        }
    };

    onClickCancelSubscribe = (id: string) => {
        return () => {
            this.injectedProps.tasksStore.cancelSubscribe(id);
        }
    };

    onClickContinueSubscribe = (id: string) => {
        return () => {
            this.injectedProps.tasksStore.subscribe(id);
        }
    };

    render() {
        const {tasks, isLoading} = this.injectedProps.tasksStore;
        const hasTasks = !!tasks.length;

        return (
            <>
                {hasTasks ? (
                    <div className="tasks">
                        {tasks.map((task: TaskProps) => {
                            const {isUpdating, isSubscribed, status} = task;
                            const isProcessing = status === Status.PROCESSING;
                            const progress = isDef(task.progress) ? +task.progress * 100 : task.progress; // convert to percent

                            return (
                                <div className="tasks__item" key={task.id}>
                                    <Task
                                        className="tasks__item-task"
                                        {...task}
                                        progress={progress}
                                    />

                                    {isProcessing && (
                                        <>
                                            <Button type={ButtonType.DANGER}
                                                    loading={isUpdating}
                                                    onClick={this.onClickCancelTask(task.id)}>
                                                Отменить
                                            </Button>

                                            {!isUpdating ? (
                                                isSubscribed ? (
                                                    <Button type={ButtonType.WARNING}
                                                            onClick={this.onClickCancelSubscribe(task.id)}>
                                                        Отменить подписку
                                                    </Button>
                                                ) : (
                                                    <Button type={ButtonType.PRIMARY}
                                                            onClick={this.onClickContinueSubscribe(task.id)}>
                                                        Продолжить подписку
                                                    </Button>
                                                )
                                            ) : null}
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : null}

                <Button type={ButtonType.PRIMARY}
                        loading={isLoading}
                        onClick={this.onClickCreateTask}>
                    Создать задачу
                </Button>
            </>
        )
    }
}