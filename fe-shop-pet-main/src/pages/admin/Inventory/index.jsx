import { useState, useEffect, useMemo } from 'react';
import styles from './Inventory.module.scss';
import ModalWarehouse from '../../../components/ModalComponents/ModalWarehouse';
import warehouseApis from '../../../apis/admin/warehouseApi';
import ModalAddWarehouse from '../../../components/ModalComponents/ModalAddWarehouse';

const Inventory = () => {
    // Cấu hình cột hiển thị
    const columns = [
        { label: 'Mã phiếu', width: '15%' },
        { label: 'Thời gian nhập', width: '25%' },
        { label: 'Ghi chú / Nội dung', width: '45%' }, // Chiếm nhiều chỗ nhất
        { label: 'Hành động', width: '15%' },
    ];

    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isReload, setIsReload] = useState(false);

    // Tính toán thống kê (Dashboard mini)
    const stats = useMemo(() => {
        const totalReceipts = data.length;
        const today = new Date().toDateString();
        const newToday = data.filter((item) => new Date(item.receiveTime).toDateString() === today).length;
        return { totalReceipts, newToday };
    }, [data]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Debounce search
        if (window.debounce) clearTimeout(window.debounce);
        window.debounce = setTimeout(() => {
            if (value === '') {
                setFilterData(data);
            } else {
                // Tìm theo ID hoặc Note
                const lowerSearch = value.toLowerCase();
                setFilterData(
                    data.filter(
                        (item) =>
                            item.id.toString().includes(lowerSearch) ||
                            (item.note && item.note.toLowerCase().includes(lowerSearch)),
                    ),
                );
            }
        }, 300);
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    const deleteReceipt = async (id) => {
        try {
            await warehouseApis.deleteReceipt(id);
            setIsReload((prev) => !prev); // Trigger reload
        } catch (e) {
            alert('Xóa không thành công');
        }
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await warehouseApis.getAllReceipt();
                // Sắp xếp mới nhất lên đầu
                const sortedData = response.data.data.sort((a, b) => new Date(b.receiveTime) - new Date(a.receiveTime));
                setData(sortedData);
                setFilterData(sortedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetch();
    }, [isReload]);

    // Helper format ngày giờ
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return {
            date: date.toLocaleDateString('vi-VN'),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    return (
        <div className={styles['wrapper']}>
            {/* Modal Components */}
            {isShow && (
                <ModalWarehouse
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    data={filterData}
                    setData={setFilterData}
                />
            )}
            {isShowAdd && <ModalAddWarehouse setIsShow={setIsShowAdd} setIsReload={setIsReload} />}

            {/* Dashboard Stats */}
            <div className={styles['stats-container']}>
                <div className={styles['stat-card']}>
                    <div className={styles['stat-icon']} style={{ background: '#e3f2fd', color: '#1976d2' }}>
                        <i className="fa-solid fa-boxes-stacked"></i>
                    </div>
                    <div className={styles['stat-info']}>
                        <h3>{stats.totalReceipts}</h3>
                        <p>Tổng phiếu nhập</p>
                    </div>
                </div>
                <div className={styles['stat-card']}>
                    <div className={styles['stat-icon']} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div className={styles['stat-info']}>
                        <h3>{stats.newToday}</h3>
                        <p>Phiếu hôm nay</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles['container']}>
                {/* Header & Filter */}
                <div className={styles['header-actions']}>
                    <div className={styles['title-section']}>
                        <h2>Danh sách nhập kho</h2>
                        <span className={styles['subtitle']}>Quản lý lịch sử nhập hàng hóa</span>
                    </div>

                    <div className={styles['actions-section']}>
                        <div className={styles['search-bar']}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Tìm theo mã, ghi chú..."
                            />
                        </div>
                        <button className={styles['btn-add']} onClick={() => setIsShowAdd(true)}>
                            <i className="fa-solid fa-plus"></i> Nhập hàng mới
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className={styles['table-wrapper']}>
                    <div className={styles['table-header']}>
                        {columns.map((col, index) => (
                            <div key={index} className={styles['th-item']} style={{ width: col.width }}>
                                {col.label}
                            </div>
                        ))}
                    </div>

                    <div className={styles['table-body']}>
                        {filterData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-regular fa-folder-open"></i>
                                <p>Chưa có dữ liệu phiếu nhập</p>
                            </div>
                        ) : (
                            filterData.map((item) => {
                                const { date, time } = formatDate(item.receiveTime);
                                return (
                                    <div className={styles['table-row']} key={item.id}>
                                        <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                            <span className={styles['id-badge']}>#{item.id}</span>
                                        </div>
                                        <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                            <div className={styles['date-wrapper']}>
                                                <span className={styles['time-text']}>{time}</span>
                                                <span className={styles['date-text']}>{date}</span>
                                            </div>
                                        </div>
                                        <div className={styles['td-item']} style={{ width: columns[2].width }}>
                                            <p className={styles['note-text']}>{item.note || '---'}</p>
                                        </div>
                                        <div className={styles['td-item']} style={{ width: columns[3].width }}>
                                            <div className={styles['action-buttons']}>
                                                <button
                                                    className={styles['btn-icon-edit']}
                                                    onClick={() => handleEditItem(item)}
                                                    title="Chi tiết / Sửa"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    className={styles['btn-icon-delete']}
                                                    onClick={() => {
                                                        if (confirm(`Xóa phiếu nhập #${item.id}?`))
                                                            deleteReceipt(item.id);
                                                    }}
                                                    title="Xóa phiếu"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
