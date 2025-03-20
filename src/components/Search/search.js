import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '~/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './search.scss.module.scss';

const cx = classNames.bind(styles);
const Search = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);
    const hanldeSearch = async () => {
        try {
            const rp = await api.get(`car/search/${query}`);
            setResult(rp.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (query) {
            const timer = setTimeout(() => {
                hanldeSearch();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setResult([]);
        }
    }, [query]);
    return (
        <div className={cx('wraper')}>
            <div className={cx('inner')}>
                <div className={cx('search-input')}>
                    <input
                        onChange={(e) => {
                            setQuery(e.target.value);
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
