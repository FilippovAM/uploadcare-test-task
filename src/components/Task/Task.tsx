import React from 'react';
import classNames from 'classnames';

import {TaskProps} from '../../stores/TasksStore';
import {isDef} from '../../utils/utils';

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

    const showProgress = isDef(progress);

    return (
        <div className={classes}>
            <div>id: {id}</div>
            <div>status: {status}</div>
            {showProgress && <div>progress: {progress}%</div>}
        </div>
    )
};