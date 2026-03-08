import React, { useEffect, useState, useCallback } from 'react';
import styles from './Dashboard.module.scss';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import dashboardApis from '../../../apis/admin/dashboardApis';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Title);

const COLORS = {
    primary: 'rgba(54, 162, 235, 1)',
    primaryBg: 'rgba(54, 162, 235, 0.2)',
    success: 'rgba(75, 192, 192, 1)',
    warning: 'rgba(255, 205, 86, 1)',
    danger: 'rgba(255, 99, 132, 1)',
    purple: 'rgba(153, 102, 255, 1)',
    orange: 'rgba(255, 159, 64, 1)',
};

const PERIOD_OPTIONS = [
    { value: 'TODAY', label: 'Hôm nay' },
    { value: 'YESTERDAY', label: 'Hôm qua' },
    { value: 'WEEK', label: 'Tuần này' },
    { value: 'MONTH', label: 'Tháng này' },
    { value: 'QUARTER', label: 'Quý này' },
    { value: 'YEAR', label: 'Năm nay' },
    { value: 'CUSTOM', label: 'Tùy chỉnh' },
];

const STATUS_MAP = {
    PENDING: { label: 'Chờ xác nhận', class: styles.badgePending },
    CONFIRMED: { label: 'Đã xác nhận', class: styles.badgeConfirmed },
    SHIPPED: { label: 'Đang giao', class: styles.badgeShipped },
    DELIVERED: { label: 'Đã giao', class: styles.badgeDelivered },
    CANCELLED: { label: 'Đã hủy', class: styles.badgeCancelled },
};

export default function Dashboard() {
    // Filter States
    const [period, setPeriod] = useState('WEEK');
    const [customDates, setCustomDates] = useState({ start: '', end: '' });

    // Loading States
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [loadingOps, setLoadingOps] = useState(true);

    // Analytical Data (Depends on Period)
    const [kpis, setKpis] = useState(null);
    const [revenues, setRevenues] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState([]);

    // Operational Data (Real-time snapshots)
    const [lowStock, setLowStock] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    // 1. Load Operational Data (Chỉ chạy 1 lần khi mount)
    useEffect(() => {
        const loadOperationalData = async () => {
            setLoadingOps(true);
            try {
                const [stockRes, recentRes] = await Promise.all([
                    dashboardApis.getLowStock(10), // Lấy 10 sp sắp hết
                    dashboardApis.getRecentOrders(10), // Lấy 10 đơn gần nhất
                ]);
                setLowStock(stockRes.data.data);
                setRecentOrders(recentRes.data.data);
            } catch (error) {
                console.error('Error loading ops data:', error);
            } finally {
                setLoadingOps(false);
            }
        };
        loadOperationalData();
    }, []); // Empty dependency array

    // 2. Load Analytical Data (Chạy khi đổi Period hoặc Custom Date)
    const loadAnalyticalData = useCallback(async () => {
        // Nếu chọn Custom nhưng chưa nhập đủ ngày thì không gọi API
        if (period === 'CUSTOM' && (!customDates.start || !customDates.end)) return;

        setLoadingAnalytics(true);
        try {
            const params = {
                period,
                ...(period === 'CUSTOM' && { startDate: customDates.start, endDate: customDates.end }),
            };

            const [kpiRes, revRes, osRes, topRes, catRes] = await Promise.all([
                dashboardApis.getKpis(params),
                dashboardApis.getRevenues(params),
                dashboardApis.getOrderStatus(params),
                dashboardApis.getTopProducts({ ...params, limit: 5 }),
                dashboardApis.getRevenueByCategory(params),
            ]);

            setKpis(kpiRes.data.data);
            setRevenues(revRes.data.data);
            setOrderStatus(osRes.data.data);
            setTopProducts(topRes.data.data);
            setCategoryRevenue(catRes.data.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoadingAnalytics(false);
        }
    }, [period, customDates]);

    useEffect(() => {
        loadAnalyticalData();
    }, [loadAnalyticalData]);

    // --- Handlers ---
    const handlePeriodChange = (e) => setPeriod(e.target.value);

    const handleCustomDateChange = (field, value) => {
        setCustomDates((prev) => ({ ...prev, [field]: value }));
    };

    // --- Chart Configurations ---
    const revenueChartData = {
        labels: revenues.map((r) => new Date(r.date).toLocaleDateString('vi-VN')),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: revenues.map((r) => r.revenue),
                borderColor: COLORS.primary,
                backgroundColor: COLORS.primaryBg,
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const orderPieData = {
        labels: orderStatus.map((o) => STATUS_MAP[o.trangThai]?.label || o.trangThai),
        datasets: [
            {
                data: orderStatus.map((o) => o.soLuong),
                backgroundColor: [COLORS.warning, COLORS.success, COLORS.primary, COLORS.purple, COLORS.danger],
                borderWidth: 1,
            },
        ],
    };

    const topProductsData = {
        labels: topProducts.map((p) =>
            p.productName.length > 15 ? p.productName.substring(0, 15) + '...' : p.productName,
        ),
        datasets: [
            {
                label: 'Số lượng bán',
                data: topProducts.map((p) => p.totalSold),
                backgroundColor: COLORS.success,
                borderRadius: 4,
            },
        ],
    };

    const categoryPieData = {
        labels: categoryRevenue.map((c) => c.categoryName),
        datasets: [
            {
                label: 'Doanh thu',
                data: categoryRevenue.map((c) => c.revenue),
                backgroundColor: Object.values(COLORS),
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className={styles.dashboard}>
            {/* Header & Filter */}
            <div className={styles.filterSection}>
                <div>
                    <h2>Tổng quan kinh doanh</h2>
                    <p className={styles.subTitle}>Thống kê số liệu cửa hàng</p>
                </div>

                <div className={styles.filters}>
                    {period === 'CUSTOM' && (
                        <div className={styles.customDates}>
                            <input
                                type="date"
                                value={customDates.start}
                                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            />
                            <span>-</span>
                            <input
                                type="date"
                                value={customDates.end}
                                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            />
                        </div>
                    )}

                    <select value={period} onChange={handlePeriodChange} className={styles.periodSelect}>
                        {PERIOD_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button className={styles.refreshBtn} onClick={loadAnalyticalData} title="Làm mới dữ liệu">
                        ↻
                    </button>
                </div>
            </div>

            {/* KPIs Section */}
            {loadingAnalytics || !kpis ? (
                <div className={styles.loadingBlock}>Đang tải dữ liệu thống kê...</div>
            ) : (
                <div className={styles.kpiGrid}>
                    <KpiCardComparison
                        title="Doanh thu"
                        current={kpis.currentRevenue}
                        change={kpis.revenueChange}
                        format="currency"
                    />
                    <KpiCardComparison
                        title="Đơn hàng"
                        current={kpis.currentOrders}
                        change={kpis.ordersChange}
                        format="number"
                    />
                    <KpiCard title="Tổng khách hàng" value={kpis.totalCustomers} icon="👥" />
                    <KpiCard title="Tỉ lệ hủy đơn" value={kpis.cancelRate} suffix="%" isRate={true} />
                </div>
            )}

            {/* Charts Section */}
            {!loadingAnalytics && (
                <>
                    <div className={styles.chartRow}>
                        <div className={styles.chartCard}>
                            <h3>Biểu đồ doanh thu</h3>
                            <div className={styles.chartWrapper}>
                                <Line
                                    data={revenueChartData}
                                    options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                                />
                            </div>
                        </div>
                        <div className={styles.chartCard}>
                            <h3>Trạng thái đơn hàng</h3>
                            <div className={styles.chartWrapper}>
                                <Pie data={orderPieData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartRow}>
                        <div className={styles.chartCard}>
                            <h3>Top 5 sản phẩm bán chạy</h3>
                            <div className={styles.chartWrapper}>
                                <Bar
                                    data={topProductsData}
                                    options={{
                                        indexAxis: 'y',
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.chartCard}>
                            <h3>Doanh thu theo danh mục</h3>
                            <div className={styles.chartWrapper}>
                                <Pie data={categoryPieData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Operational Tables (Recent Orders & Low Stock) */}
            <div className={styles.rowTwo}>
                <div className={styles.tableCard}>
                    <h3> Cảnh báo tồn kho</h3>
                    {loadingOps ? (
                        <div className={styles.loadingText}>Đang tải...</div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th style={{ textAlign: 'right' }}>Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStock.length > 0 ? (
                                        lowStock.map((item) => (
                                            <tr key={item.maSanPham}>
                                                <td className={styles.productName}>
                                                    <img
                                                        src={item.anhMinhHoa || 'https://via.placeholder.com/40'}
                                                        alt=""
                                                    />
                                                    <span title={item.tenSanPham}>{item.tenSanPham}</span>
                                                </td>
                                                <td
                                                    style={{ textAlign: 'right' }}
                                                    className={item.soLuong <= 0 ? styles.negative : styles.lowQty}
                                                >
                                                    {item.soLuong}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colspan="2" style={{ textAlign: 'center' }}>
                                                Kho hàng ổn định
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className={styles.tableCard}>
                    <h3> Đơn hàng mới nhất</h3>
                    {loadingOps ? (
                        <div className={styles.loadingText}>Đang tải...</div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Khách</th>
                                        <th>Tổng</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.maHoaDon}>
                                            <td>#{order.maHoaDon}</td>
                                            <td>
                                                <div className={styles.customerName}>{order.hoTen}</div>
                                                <div className={styles.dateSmall}>
                                                    {new Date(order.ngayBan).toLocaleDateString('vi-VN')}
                                                </div>
                                            </td>
                                            <td>{order.tongTien.toLocaleString()}đ</td>
                                            <td>
                                                <span className={STATUS_MAP[order.trangThai]?.class || ''}>
                                                    {STATUS_MAP[order.trangThai]?.label || order.trangThai}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function KpiCard({ title, value, suffix = '', icon, isRate }) {
    // Nếu là tỉ lệ, tô màu cảnh báo nếu cao
    let colorClass = '';
    if (isRate) {
        colorClass = value > 20 ? styles.negative : styles.positive; // Ví dụ: hủy > 20% là đỏ
    }

    return (
        <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
                <p className={styles.kpiTitle}>{title}</p>
                {icon && <span className={styles.kpiIcon}>{icon}</span>}
            </div>
            <p className={`${styles.kpiValue} ${colorClass}`}>
                {value != null ? value.toLocaleString() : 0}
                {suffix}
            </p>
        </div>
    );
}

function KpiCardComparison({ title, current, change, format }) {
    const isPositive = change >= 0;
    const formattedValue =
        format === 'currency' ? (current || 0).toLocaleString() + 'đ' : (current || 0).toLocaleString();

    return (
        <div className={styles.kpiCard}>
            <p className={styles.kpiTitle}>{title}</p>
            <div className={styles.kpiContent}>
                <p className={styles.kpiValue}>{formattedValue}</p>
                <div className={`${styles.badgeChange} ${isPositive ? styles.inc : styles.dec}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(change || 0).toFixed(1)}%
                </div>
            </div>
            <p className={styles.kpiSub}>so với kỳ trước</p>
        </div>
    );
}
