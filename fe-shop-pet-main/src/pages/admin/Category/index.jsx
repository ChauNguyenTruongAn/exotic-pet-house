import { useState, useEffect, useMemo } from 'react';
import styles from './Category.module.scss';
import categoryApi from '../../../apis/admin/categoryApi';
import Modal from '../../../components/ModalComponents/Modal';
import ModalAddCategory from '../../../components/ModalComponents/ModalAddCategory';

const Category = () => {
    // Columns config (để dễ chỉnh sửa độ rộng sau này)
    const columns = [
        { label: 'ID', width: '15%' },
        { label: 'Tên danh mục', width: '65%' }, // Cột tên chiếm đa số
        { label: 'Thao tác', width: '20%' },
    ];

    // Fake data mẫu nếu API chưa có dữ liệu
    const [data, setData] = useState([
        { id: 1, name: 'Kiến' },
        { id: 2, name: 'Côn trùng' },
        { id: 3, name: 'Chân khớp' },
        { id: 4, name: 'Bò sát' },
        { id: 5, name: 'Lưỡng cư' },
        { id: 6, name: 'Phụ kiện nuôi' },
    ]);

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Lọc dữ liệu tự động khi search thay đổi (dùng useMemo tối ưu hiệu năng)
    const filterData = useMemo(() => {
        if (!search.trim()) return data;
        return data.filter(
            (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toString().includes(search),
        );
    }, [data, search]);

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    const handleAddItem = () => {
        setIsShowAdd(true);
    };

    const updateItem = async (updatedItem) => {
        try {
            // Giả lập call API
            await categoryApi.updateCategory(selectedItem.id, { newName: updatedItem.name });
            setData((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
            setIsShow(false);
        } catch (e) {
            alert('Cập nhật thất bại');
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await categoryApi.addCategory(newItem);
            setData([...data, response.data.data]);

            const mockItem = { id: data.length + 1, ...newItem };
            setData([...data, mockItem]);
            setIsShowAdd(false);
        } catch (e) {
            alert('Thêm mới thất bại');
        }
    };

    const deleteItem = async (id, name) => {
        if (confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
            try {
                // await categoryApi.deleteCategory(id);
                setData((prev) => prev.filter((item) => item.id !== id));
            } catch (e) {
                alert('Xóa thất bại');
            }
        }
    };

    const fetch = async () => {
        try {
            const response = await categoryApi.getAllCategory();
            if (response?.data?.data) setData(response.data.data);
        } catch (e) {
            console.log('Dùng dữ liệu mẫu do lỗi API hoặc chưa kết nối');
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    // Helper tạo avatar ký tự đầu (Ví dụ: Kiến -> K)
    const getFirstLetter = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    // Helper random màu nền cho avatar dựa trên ID (để cố định màu cho mỗi item)
    const getAvatarColor = (id) => {
        const colors = ['#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#ffebee'];
        const textColors = ['#1976d2', '#2e7d32', '#ef6c00', '#7b1fa2', '#006064', '#c62828'];
        const index = id % colors.length;
        return { bg: colors[index], text: textColors[index] };
    };

    return (
        <div className={styles['wrapper']}>
            {/* Modal Edit */}
            {isShow && (
                <Modal
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    updateItem={updateItem}
                />
            )}

            {/* Modal Add */}
            {isShowAdd && <ModalAddCategory setIsShow={setIsShowAdd} data={data} addItem={addItem} />}

            <div className={styles['container']}>
                {/* Header Section */}
                <div className={styles['header']}>
                    <div className={styles['header-title']}>
                        <h2>Quản lý Danh mục</h2>
                        <p>Phân loại sản phẩm của hệ thống</p>
                    </div>
                    <button className={styles['btn-add']} onClick={handleAddItem}>
                        <i className="fa-solid fa-plus"></i>
                        <span>Tạo mới</span>
                    </button>
                </div>

                {/* Filter & Stats Section */}
                <div className={styles['toolbar']}>
                    <div className={styles['search-box']}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm danh mục..."
                        />
                    </div>
                    <div className={styles['stats']}>
                        Tổng số: <strong>{data.length}</strong> danh mục
                    </div>
                </div>

                {/* Table Section */}
                <div className={styles['table-wrapper']}>
                    <div className={styles['table-header']}>
                        {columns.map((col, idx) => (
                            <div key={idx} className={styles['th-item']} style={{ width: col.width }}>
                                {col.label}
                            </div>
                        ))}
                    </div>

                    <div className={styles['table-body']}>
                        {filterData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-folder-open"></i>
                                <p>Không tìm thấy dữ liệu</p>
                            </div>
                        ) : (
                            filterData.map((item) => {
                                const colors = getAvatarColor(item.id);
                                return (
                                    <div
                                        className={styles['table-row']}
                                        key={item.id}
                                        onClick={() => handleEditItem(item)} // Click dòng để sửa
                                    >
                                        {/* Cột ID */}
                                        <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                            <span className={styles['id-badge']}>#{item.id}</span>
                                        </div>

                                        {/* Cột Tên (kèm Avatar) */}
                                        <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                            <div className={styles['category-info']}>
                                                <div
                                                    className={styles['avatar']}
                                                    style={{ backgroundColor: colors.bg, color: colors.text }}
                                                >
                                                    {getFirstLetter(item.name)}
                                                </div>
                                                <span className={styles['name-text']}>{item.name}</span>
                                            </div>
                                        </div>

                                        {/* Cột Thao tác */}
                                        <div className={styles['td-item']} style={{ width: columns[2].width }}>
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
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;
