import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '~/api/api';

import classNames from 'classnames/bind';
import styles from './notFound.scss.module.scss';

const cx = classNames.bind(styles);

const NotFound = ({ title, describe }) => {
    return (
        <>
            <div className="wraper">
                <div className="row-nowrap">
                    <div className="col">
                        <img src="https://muaban.net/images/not-found.png"></img>
                    </div>
                    <div className="col">
                        <h1>{title}</h1>
                        <p>{describe}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NotFound;
