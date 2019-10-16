import React from 'react';
import {inject, observer} from 'mobx-react';

import {Button, ButtonType} from '../../components/Button/Button';
import {TaskProps} from '../../stores/TasksStore';
import {Task} from '../../components/Task/Task';
import {Status} from '../../constants/enums';

interface InjectedProps {
    tasksStore: {
        tasks: TaskProps[];
        isLoading: boolean;
        createTask: () => void;
        cancelTask: (id: string) => void;
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

    render() {
        const {tasks, isLoading} = this.injectedProps.tasksStore;
        const hasTasks = !!tasks.length;

        return (
            <>
                {hasTasks ? (
                    <div className="tasks">
                        {tasks.map((task: TaskProps) => {
                            const {isUpdating, status} = task;
                            const isProcessing = status === Status.PROCESSING;

                            return (
                                <div className="tasks__item" key={task.id}>
                                    <Task
                                        className="tasks__item-task"
                                        {...task}
                                    />

                                    {isProcessing && (
                                        <Button type={ButtonType.DANGER}
                                                loading={isUpdating}
                                                onClick={this.onClickCancelTask(task.id)}>Отменить</Button>
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