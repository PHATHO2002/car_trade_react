import PendingProducts from './PendingCars/PendingCars';
function AdminHomePage() {
    const functions = [
        { name: 'Quản lý người dùng', icon: '', path: '/admin/users' },
        { name: 'Quản lý sản phẩm', icon: '', path: '/admin/products' },
        { name: 'Quản lý đơn hàng', icon: '', path: '/admin/orders' },
        { name: 'Cài đặt hệ thống', icon: '', path: '/admin/settings' },
    ];

    return (
        <div className="admin-page">
            <h2>Chức năng Quản trị</h2>
            <div className="function-list">
                {functions.map((func, index) => (
                    <div key={index} className="function-card">
                        <span className="icon">{func.icon}</span>
                        <p>{func.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminHomePage;
