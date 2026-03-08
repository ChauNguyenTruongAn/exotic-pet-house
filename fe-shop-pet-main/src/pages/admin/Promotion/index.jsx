import { useState, useEffect, useMemo } from 'react';
import styles from './Promotion.module.scss';
import promotionApi from '../../../apis/admin/promotionApi';
import ModalPromotion from '../../../components/ModalComponents/ModelProduction';
import ModalAddPromotion from '../../../components/ModalComponents/ModalAddPromotion';

const Promotion = () => {
    // Cấu hình cột
    const columns = [
        { label: 'Mã Voucher', width: '15%' },
        { label: 'Thông tin chương trình', width: '25%' },
        { label: 'Giá trị giảm', width: '15%' },
        { label: 'Thời gian áp dụng', width: '20%' },
        { label: 'Trạng thái', width: '15%' },
        { label: 'Thao tác', width: '10%' },
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Tối ưu Search
    const filterData = useMemo(() => {
        if (!search.trim()) return data;
        const lowerSearch = search.toLowerCase();
        return data.filter(
            (item) =>
                (item.code && item.code.toLowerCase().includes(lowerSearch)) ||
                (item.name && item.name.toLowerCase().includes(lowerSearch)),
        );
    }, [data, search]);

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    // Format ngày ngắn gọn
    const formatDate = (isoString) => {
        if (!isoString) return '--/--';
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Helper xác định trạng thái hiển thị (Logic UI bổ trợ cho data)
    const getStatusInfo = (item) => {
        const now = new Date();
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);

        // Ưu tiên trạng thái từ API nếu có, nếu không thì tự tính
        let status = item.status;

        // Nếu API trả về ACTIVE nhưng đã quá hạn -> Hiển thị Expired
        if (now > end) return { label: 'Đã kết thúc', class: 'expired' };
        if (now < start) return { label: 'Sắp diễn ra', class: 'upcoming' };
        if (status === 'INACTIVE') return { label: 'Tạm dừng', class: 'disabled' };

        return { label: 'Đang chạy', class: 'active' };
    };

    // --- API Handlers ---
    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const response = await promotionApi.getAllPromotion();
            const result = response.data?.data || [];
            // Sắp xếp mới nhất lên đầu
            setData(result.reverse());
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await promotionApi.addPromotion(newItem);
            setData([response.data.data, ...data]);
            setIsShowAdd(false);
        } catch (e) {
            alert('Thêm mới thất bại');
        }
    };

    const updateItem = async (updatedItem) => {
        try {
            const response = await promotionApi.updatePromotion(updatedItem.id, updatedItem);
            setData(data.map((item) => (item.id === updatedItem.id ? response.data.data : item)));
            setIsShow(false);
        } catch (e) {
            alert('Cập nhật thất bại');
        }
    };

    const deleteItem = async (id, code) => {
        if (confirm(`Bạn có chắc muốn xóa mã khuyến mãi "${code}"?`)) {
            try {
                await promotionApi.deletePromotion(id);
                setData(data.filter((item) => item.id !== id));
            } catch (error) {
                alert('Xóa thất bại');
            }
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    return (
        <div className={styles['wrapper']}>
            {/* Modals */}
            {isShow && (
                <ModalPromotion
                    isShow={isShow}
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    updateItem={updateItem}
                />
            )}
            {isShowAdd && <ModalAddPromotion isShow={isShowAdd} setIsShow={setIsShowAdd} addItem={addItem} />}

            <div className={styles['container']}>
                {/* Header */}
                <div className={styles['header']}>
                    <div className={styles['header-title']}>
                        <h2>Quản lý khuyến mãi</h2>
                        <p>Danh sách mã giảm giá và chương trình ưu đãi</p>
                    </div>
                    <button className={styles['btn-add']} onClick={() => setIsShowAdd(true)}>
                        <i className="fa-solid fa-ticket"></i>
                        <span>Tạo mã mới</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className={styles['toolbar']}>
                    <div className={styles['search-box']}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm mã code, tên chương trình..."
                        />
                    </div>
                    <div className={styles['stats']}>
                        Tổng số: <strong>{data.length}</strong> chương trình
                    </div>
                </div>

                {/* Table */}
                <div className={styles['table-wrapper']}>
                    <div className={styles['table-header']}>
                        {columns.map((col, idx) => (
                            <div key={idx} className={styles['th-item']} style={{ width: col.width }}>
                                {col.label}
                            </div>
                        ))}
                    </div>

                    <div className={styles['table-body']}>
                        {isLoading ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : filterData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-ticket-simple"></i>
                                <p>Chưa có chương trình khuyến mãi nào</p>
                            </div>
                        ) : (
                            filterData.map((item) => {
                                const statusInfo = getStatusInfo(item);
                                return (
                                    <div
                                        className={styles['table-row']}
                                        key={item.id}
                                        onClick={() => handleEditItem(item)}
                                    >
                                        {/* Mã Code */}
                                        <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                            <span className={styles['code-badge']}>
                                                <i className="fa-solid fa-tag"></i> {item.code}
                                            </span>
                                        </div>

                                        {/* Tên & Mô tả */}
                                        <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                            <div className={styles['info-col']}>
                                                <span className={styles['name-text']}>{item.name}</span>
                                                <span className={styles['sub-text']}>
                                                    Đơn tối thiểu: {formatCurrency(item.minimumOrder)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Giá trị giảm */}
                                        <div className={styles['td-item']} style={{ width: columns[2].width }}>
                                            <div className={styles['value-col']}>
                                                {item.type === 'PERCENT' ? (
                                                    <span className={styles['value-percent']}>-{item.value}%</span>
                                                ) : (
                                                    <span className={styles['value-amount']}>
                                                        -{formatCurrency(item.value)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Thời gian */}
                                        <div className={styles['td-item']} style={{ width: columns[3].width }}>
                                            <div className={styles['date-col']}>
                                                <div className={styles['date-row']}>
                                                    <i className="fa-regular fa-clock"></i>
                                                    <span>{formatDate(item.startDate)}</span>
                                                </div>
                                                <div className={styles['date-arrow']}>↓</div>
                                                <div className={styles['date-row']}>
                                                    <i className="fa-solid fa-flag-checkered"></i>
                                                    <span>{formatDate(item.endDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trạng thái */}
                                        <div className={styles['td-item']} style={{ width: columns[4].width }}>
                                            <span className={`${styles['status-badge']} ${styles[statusInfo.class]}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Thao tác */}
                                        <div className={styles['td-item']} style={{ width: columns[5].width }}>
                                            <div className={styles['actions']}>
                                                <button
                                                    className={`${styles['btn-icon']} ${styles['edit']}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditItem(item);
                                                    }}
                                                    title="Sửa"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    className={`${styles['btn-icon']} ${styles['delete']}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteItem(item.id, item.code);
                                                    }}
                                                    title="Xóa"
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

export default Promotion;
