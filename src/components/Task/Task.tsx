import React from 'react';
import classNames from 'classnames';

import {TaskProps} from '../../stores/TasksStore';

interface ITaskProps extends TaskProps {
    className?: string;
}

export const Task = (props: ITaskProps) => {
    const {id, status, progress, className} = props;

    const classes = classNames(
        'task',
        {[`task-${status}`]: !!status},
        className,
    );

    return (
        <div className={classes}>
            <div>id: {id}</div>
            <div>status: {status}</div>
            <div>progress: {progress}%</div>
        </div>
    )
};