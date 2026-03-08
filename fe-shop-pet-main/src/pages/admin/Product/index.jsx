import { useState, useEffect, useMemo } from 'react';
import styles from './Product.module.scss';
import productApi from '../../../apis/admin/productApi';
import ModalProduct from '../../../components/ModalComponents/ModalProduct';
import ModalAddProduct from '../../../components/ModalComponents/ModalAddProduct';
import uploadImageApis from '../../../apis/admin/uploadImageApi';

const Product = () => {
    // Cấu hình cột (Độ rộng cộng lại = 100%)
    const columns = [
        { label: 'Mã SP', width: '10%' },
        { label: 'Ảnh minh họa', width: '15%' },
        { label: 'Tên sản phẩm', width: '40%' },
        { label: 'Giá bán', width: '20%' },
        { label: 'Tồn kho', width: '20%' },
        { label: 'Thao tác', width: '15%' },
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    // Modal states
    const [isShow, setIsShow] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter Data tự động với useMemo
    const filterData = useMemo(() => {
        if (!search.trim()) return data;
        const lowerSearch = search.toLowerCase();
        return data.filter(
            (item) => item.name.toLowerCase().includes(lowerSearch) || item.id.toString().includes(lowerSearch),
        );
    }, [data, search]);

    // Pagination logic
    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filterData.slice(startIndex, endIndex);
    }, [filterData, currentPage, itemsPerPage]);

    // Reset về trang 1 khi search thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Format tiền tệ
    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    const handleAddItem = () => {
        setIsShowAdd(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset về trang 1
    };

    // Tạo danh sách các trang hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // --- API Handlers ---
    const fetch = async () => {
        try {
            const response = await productApi.getAllProduct();
            console.log(response.data.data);
            if (response?.data?.data) setData(response.data.data);
        } catch (error) {
            console.error('Lỗi tải dữ liệu');
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await productApi.addProduct(newItem);
            setData([...data, response.data.data]);
            setIsShowAdd(false);
        } catch (error) {
            alert('Thêm mới thất bại');
        }
    };

    const updateItem = async (updatedItem) => {
        try {
            const response = await productApi.updateProduct(updatedItem.id, updatedItem);
            setData(data.map((item) => (item.id === updatedItem.id ? response.data.data : item)));
            setIsShow(false);
        } catch (error) {
            alert('Cập nhật thất bại');
        }
    };

    const deleteItem = async (id, name) => {
        if (confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
            try {
                const response = await productApi.deleteProduct(id);
                if (response) {
                    setData(data.filter((item) => item.id !== id));

                    // Nếu xóa hết item ở trang cuối, quay lại trang trước
                    if (paginatedData.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                }
            } catch (error) {
                alert('Không thể xóa sản phẩm này');
            }
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <div className={styles['wrapper']}>
            {/* --- Modals --- */}
            {isShowAdd && <ModalAddProduct isShow={isShowAdd} setIsShow={setIsShowAdd} addItem={addItem} />}

            {isShow && (
                <ModalProduct
                    isShow={isShow}
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    updateItem={updateItem}
                />
            )}

            <div className={styles['container']}>
                {/* --- Header --- */}
                <div className={styles['header']}>
                    <div className={styles['header-title']}>
                        <h2>Quản lý Sản phẩm</h2>
                        <p>Danh sách các mặt hàng đang kinh doanh</p>
                    </div>
                    <button className={styles['btn-add']} onClick={handleAddItem}>
                        <i className="fa-solid fa-plus"></i>
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>

                {/* --- Toolbar (Search & Stats) --- */}
                <div className={styles['toolbar']}>
                    <div className={styles['search-box']}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm tên, mã sản phẩm..."
                        />
                    </div>
                    <div className={styles['stats']}>
                        Tổng số: <strong>{filterData.length}</strong> sản phẩm
                    </div>
                </div>

                {/* --- Table --- */}
                <div className={styles['table-wrapper']}>
                    <div className={styles['table-header']}>
                        {columns.map((col, idx) => (
                            <div key={idx} className={styles['th-item']} style={{ width: col.width }}>
                                {col.label}
                            </div>
                        ))}
                    </div>

                    <div className={styles['table-body']}>
                        {paginatedData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-box-open"></i>
                                <p>Không tìm thấy sản phẩm nào</p>
                            </div>
                        ) : (
                            paginatedData.map((item) => (
                                <div className={styles['table-row']} key={item.id} onClick={() => handleEditItem(item)}>
                                    {/* ID */}
                                    <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                        <span className={styles['id-badge']}>#{item.id}</span>
                                    </div>

                                    {/* Ảnh */}
                                    <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                        <div className={styles['img-wrapper']}>
                                            <img
                                                src={item.imageLink || 'https://via.placeholder.com/50'}
                                                alt={item.name}
                                            />
                                        </div>
                                    </div>

                                    {/* Tên SP */}
                                    <div className={styles['td-item']} style={{ width: columns[2].width }}>
                                        <span className={styles['name-text']}>{item.name}</span>
                                    </div>

                                    {/* Giá bán */}
                                    <div className={styles['td-item']} style={{ width: columns[3].width }}>
                                        <span className={styles['price-text']}>{formatCurrency(item.price)}</span>
                                    </div>

                                    {/* Số lượng */}
                                    <div className={styles['td-item']} style={{ width: columns[4].width }}>
                                        <span
                                            className={styles['quantity-text']}
                                            style={{
                                                color:
                                                    item.quantityInventory <= 5
                                                        ? 'red'
                                                        : item.quantityInventory <= 10
                                                          ? 'orange'
                                                          : 'green',
                                            }}
                                        >
                                            {item.quantityInventory}
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
                                                title="Chỉnh sửa"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button
                                                className={`${styles['btn-icon']} ${styles['delete']}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteItem(item.id, item.name);
                                                }}
                                                title="Xóa"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- Pagination --- */}
                {filterData.length > 0 && (
                    <div className={styles['pagination-wrapper']}>
                        <div className={styles['pagination-info']}>
                            <span>Hiển thị</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className={styles['items-per-page']}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span>
                                từ {(currentPage - 1) * itemsPerPage + 1} -{' '}
                                {Math.min(currentPage * itemsPerPage, filterData.length)} của {filterData.length} sản
                                phẩm
                            </span>
                        </div>

                        <div className={styles['pagination-controls']}>
                            <button
                                className={styles['page-btn']}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {getPageNumbers().map((page, index) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className={styles['page-ellipsis']}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`${styles['page-number']} ${currentPage === page ? styles['active'] : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                            <button
                                className={styles['page-btn']}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
