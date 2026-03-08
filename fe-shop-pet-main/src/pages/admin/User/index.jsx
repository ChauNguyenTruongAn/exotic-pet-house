import { useState, useEffect, useMemo } from 'react';
import styles from './User.module.scss';
import userApi from '../../../apis/admin/userApi';
import ModalUser from '../../../components/ModalComponents/ModalUser';
import ModalAddUser from '../../../components/ModalComponents/ModalAddUser';

const User = () => {
    // Cấu hình cột
    const columns = [
        { label: 'ID', width: '10%' },
        { label: 'Họ tên', width: '25%' },
        { label: 'Email', width: '30%' },
        { label: 'Số điện thoại', width: '15%' },
        { label: 'Vai trò', width: '10%' },
        { label: 'Thao tác', width: '10%' },
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Tối ưu Search với useMemo
    const filterData = useMemo(() => {
        if (!search.trim()) return data;
        const lowerSearch = search.toLowerCase();
        return data.filter(
            (item) =>
                (item.fullName && item.fullName.toLowerCase().includes(lowerSearch)) ||
                (item.email && item.email.toLowerCase().includes(lowerSearch)) ||
                (item.phoneNumber && item.phoneNumber.includes(lowerSearch)) ||
                item.id.toString().includes(lowerSearch),
        );
    }, [data, search]);

    // Helpers Avatar
    const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : '?');
    const getAvatarColor = (id) => {
        const bgColors = ['#e3f2fd', '#f3e5f5', '#e0f2f1', '#fff3e0', '#ffebee', '#f1f8e9'];
        const textColors = ['#1565c0', '#7b1fa2', '#00695c', '#ef6c00', '#c62828', '#33691e'];
        return { bg: bgColors[id % bgColors.length], text: textColors[id % bgColors.length] };
    };

    // --- API Handlers ---
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await userApi.getAllUser();
            const result = response.data?.data || [];
            setData(result);
        } catch (error) {
            console.error('Lỗi tải danh sách user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await userApi.addUser(newItem);
            setData([...data, response.data.data]);
            setIsShowAdd(false);
        } catch (e) {
            alert('Thêm mới thất bại');
        }
    };

    const updateItem = async (updatedItem) => {
        try {
            const response = await userApi.updateUser(updatedItem.id, updatedItem);
            setData(data.map((item) => (item.id === updatedItem.id ? response.data.data : item)));
            setIsShow(false);
        } catch (e) {
            alert('Cập nhật thất bại');
        }
    };

    const deleteItem = async (id, name) => {
        if (confirm(`Bạn có chắc muốn xóa người dùng "${name}"?`)) {
            try {
                await userApi.deleteUser(id);
                setData(data.filter((item) => item.id !== id));
            } catch (error) {
                alert('Xóa không thành công: ' + (error.response?.data?.message || 'Lỗi server'));
            }
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={styles['wrapper']}>
            {/* --- Modals --- */}
            {isShow && (
                <ModalUser
                    isShow={isShow}
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    updateItem={updateItem}
                />
            )}

            {isShowAdd && <ModalAddUser isShow={isShowAdd} setIsShow={setIsShowAdd} addItem={addItem} />}

            <div className={styles['container']}>
                {/* --- Header --- */}
                <div className={styles['header']}>
                    <div className={styles['header-title']}>
                        <h2>Quản lý Người dùng</h2>
                        <p>Danh sách khách hàng và nhân viên hệ thống</p>
                    </div>
                    <button className={styles['btn-add']} onClick={() => setIsShowAdd(true)}>
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Thêm người dùng</span>
                    </button>
                </div>

                {/* --- Toolbar --- */}
                <div className={styles['toolbar']}>
                    <div className={styles['search-box']}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo Tên, Email, SĐT..."
                        />
                    </div>
                    <div className={styles['stats']}>
                        Tổng số: <strong>{data.length}</strong> tài khoản
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
                        {isLoading ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : filterData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-users-slash"></i>
                                <p>Không tìm thấy người dùng nào</p>
                            </div>
                        ) : (
                            filterData.map((item) => {
                                const colors = getAvatarColor(item.id);
                                return (
                                    <div
                                        className={styles['table-row']}
                                        key={item.id}
                                        onClick={() => handleEditItem(item)}
                                    >
                                        {/* ID */}
                                        <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                            <span className={styles['id-badge']}>#{item.id}</span>
                                        </div>

                                        {/* Họ tên (Avatar + Name) */}
                                        <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                            <div className={styles['user-info']}>
                                                <div
                                                    className={styles['avatar']}
                                                    style={{ backgroundColor: colors.bg, color: colors.text }}
                                                >
                                                    {getFirstLetter(item.fullName)}
                                                </div>
                                                <span className={styles['name-text']}>{item.fullName}</span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className={styles['td-item']} style={{ width: columns[2].width }}>
                                            <span className={styles['email-text']}>{item.email}</span>
                                        </div>

                                        {/* SĐT */}
                                        <div className={styles['td-item']} style={{ width: columns[3].width }}>
                                            <span>{item.phoneNumber || '---'}</span>
                                        </div>

                                        {/* Vai trò */}
                                        <div className={styles['td-item']} style={{ width: columns[4].width }}>
                                            <span
                                                className={`${styles['role-badge']} ${styles[item.role ? item.role.toLowerCase() : 'user']}`}
                                            >
                                                {item.role || 'USER'}
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
                                                        deleteItem(item.id, item.fullName);
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

export default User;
