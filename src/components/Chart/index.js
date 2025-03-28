import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

const MyChart = ({ title = 'Biểu đồ dữ liệu', data = [], type = 'bar', name = 'brand', dataKey = 'count' }) => {
    return (
        <div style={{ margin: '20px auto', textAlign: 'center', width: '100%', maxWidth: '900px', height: '350px' }}>
            <h3>{title}</h3>

            {type === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey={name} angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={dataKey} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {type === 'line' && (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey={name} angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {type === 'area' && (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey={name} angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default MyChart;
