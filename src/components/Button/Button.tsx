import React from 'react';
import classNames from 'classnames';

export enum ButtonType {
    PRIMARY = 'primary',
    DANGER = 'danger',
    WARNING = 'warning',
}

interface ButtonProps {
    type?: string;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export const Button = (props: ButtonProps) => {
    const {type, loading, loadingText, disabled, ...buttonProps} = props;

    const classes = classNames(
        'btn',
        {[`btn-${type}`]: !!type}
    );

    const isDisabled = loading || disabled;

    return (
        <button {...buttonProps} disabled={isDisabled} className={classes}>
            {loading ? loadingText : props.children}
        </button>
    )
};

Button.defaultProps = {
    loadingText: 'Загрузка...',
};