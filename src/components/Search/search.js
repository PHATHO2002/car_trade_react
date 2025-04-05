import React, { useEffect, useState } from 'react';

import api from '~/api/api';
import { searchCarApi } from '~/api/car';
import classNames from 'classnames/bind';
import styles from './search.scss.module.scss';

const cx = classNames.bind(styles);
const Search = () => {
    const [queryTitle, setQueryTitle] = useState('');
    const [result, setResult] = useState([]);
    const hanldeSearch = async () => {
        try {
            const rp = await searchCarApi(queryTitle);
            setResult(rp.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (queryTitle) {
            const timer = setTimeout(() => {
                hanldeSearch();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setResult([]);
        }
    }, [queryTitle]);
    return (
        <div className={cx('wraper')}>
            <div className={cx('inner')}>
                <div className={cx('search-input')}>
                    <input
                        onChange={(e) => {
                            setQueryTitle(e.target.value);
                        }}
                    ></input>
                </div>
            </div>
            <ul className={cx('search-result')}>
                {result.map((item) => {
                    return (
                        <li key={item._id}>
                            <p>Tên: {item.title}</p>
                            <span>Giá :{item.price.toLocaleString('de-DE')} VND</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
export default Search;
