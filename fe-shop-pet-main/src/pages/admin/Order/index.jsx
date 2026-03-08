import { useState, useEffect } from 'react';
import styles from './Order.module.scss';
import ModalOrder from '../../../components/ModalOrder';
import orderApi from '../../../apis/admin/orderApi';

const Order = () => {
    const tabs = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'CONFIRMED', label: 'Đã xác nhận' },
        { key: 'SHIPPING', label: 'Đang giao' },
        { key: 'COMPLETED', label: 'Hoàn thành' },
        { key: 'CANCELLED', label: 'Đã hủy' },
    ];

    const [activeTab, setActiveTab] = useState('ALL');

    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 đ';

    const formatDate = (isoString) => (isoString ? new Date(isoString).toLocaleDateString('vi-VN') : '');

    const getStatusBadgeClass = (status) => {
        return styles[`status-${status?.toLowerCase()}`];
    };

    // ----------- Xử lý Search & Filter ----------
    useEffect(() => {
        let clone = [...data];

        // Lọc theo tab trạng thái
        if (activeTab !== 'ALL') {
            clone = clone.filter((item) => item.status === activeTab);
        }

        // Lọc theo search text
        if (search !== '') {
            const lower = search.toLowerCase();
            clone = clone.filter((item) => {
                const name = item.customer?.fullName?.toLowerCase() || '';
                const phone = item.customer?.phone || '';
                const id = item.orderId?.toString() || '';
                return name.includes(lower) || phone.includes(lower) || id.includes(lower);
            });
        }

        setFiltered(clone);
    }, [search, activeTab, data]);

    const handleViewDetail = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    const updateItem = async (updatedItem) => {
        const response = await orderApi.updateOrder(updatedItem.orderId, {
            status: updatedItem.status,
        });

        setData((prev) => prev.map((item) => (item.orderId === updatedItem.orderId ? response.data.data : item)));

        setIsShow(false);
    };

    // ---------- Fetch Orders ----------
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await orderApi.getAllOrder();
                const result = response.data?.data || [];
                setData(result);
                setFiltered(result);
            } catch (error) {
                console.error('Lỗi tải đơn hàng:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className={styles.wrapper}>
            {isShow && (
                <ModalOrder isShow={isShow} setIsShow={setIsShow} selectedItem={selectedItem} updateItem={updateItem} />
            )}

            <p className={styles.title}>Quản lý Đơn hàng</p>

            <div className={styles.container}>
                {/* ---------- Header ---------- */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.headerTitle}>Danh sách đơn hàng</p>
                        <p className={styles.headerDesc}>Theo dõi trạng thái & xử lý đơn đặt hàng</p>
                    </div>
                </div>

                {/* ----------- Tabs Filter by Status ----------- */}
                <div className={styles.tabs}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`${styles.tabItem} ${activeTab === t.key ? styles.active : ''}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ----------- Search ----------- */}
                <div className={styles.searchBar}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo Mã đơn, Tên khách hàng, SĐT..."
                    />
                </div>

                {/* ----------- Table Header ----------- */}
                <div className={styles.tableHeader}>
                    <div>Mã Đơn</div>
                    <div>Khách hàng</div>
                    <div>Ngày đặt</div>
                    <div>Tổng tiền</div>
                    <div>Trạng thái</div>
                    <div>Thao tác</div>
                </div>

                {/* ----------- Table Content ----------- */}
                <div className={styles.tableContent}>
                    {isLoading ? (
                        <div className={styles.loading}>Đang tải đơn hàng...</div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.empty}>Không tìm thấy đơn hàng nào</div>
                    ) : (
                        filtered.map((item) => (
                            <div className={styles.tableRow} key={item.orderId}>
                                <div className={styles.bold}>#{item.orderId}</div>

                                <div className={styles.customerInfo}>
                                    <span className={styles.cusName}>{item.customer?.fullName}</span>
                                    <span className={styles.cusPhone}>{item.customer?.phone}</span>
                                </div>

                                <div>{formatDate(item.orderDate)}</div>

                                <div className={styles.price}>{formatCurrency(item.totalPrice)}</div>

                                <div>
                                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div>
                                    <button onClick={() => handleViewDetail(item)} className={styles.actionBtn}>
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;
