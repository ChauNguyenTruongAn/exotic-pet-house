import { useState, useEffect, useMemo } from 'react';
import styles from './Species.module.scss';
import speciesApi from '../../../apis/admin/speciesApi';
import ModalAppSpecies from '../../../components/ModalComponents/ModalAddSpecies';
import ModalSpecies from '../../../components/ModalComponents/ModalSpecies';

const Species = () => {
    // Cấu hình cột
    const columns = [
        { label: 'Mã loài', width: '15%' },
        { label: 'Tên loài', width: '65%' },
        { label: 'Thao tác', width: '20%' },
    ];

    const [data, setData] = useState([
        { id: 1, name: 'Kiến' },
        { id: 2, name: 'Côn trùng' },
        { id: 3, name: 'Chân khớp' },
        { id: 4, name: 'Bò sát' },
        { id: 5, name: 'Lưỡng cư' },
        { id: 6, name: 'Phụ kiện' },
    ]);

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isShowSpecies, setIsShowSpecies] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Tối ưu search bằng useMemo
    const filterData = useMemo(() => {
        if (!search.trim()) return data;
        return data.filter(
            (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toString().includes(search),
        );
    }, [data, search]);

    // Helpers tạo avatar
    const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : '?');

    // Palette màu thiên nhiên (Nature colors) cho Loài
    const getAvatarColor = (id) => {
        const bgColors = ['#e8f5e9', '#f1f8e9', '#e0f2f1', '#fff3e0', '#f3e5f5', '#e3f2fd'];
        const textColors = ['#2e7d32', '#558b2f', '#00695c', '#ef6c00', '#8e24aa', '#1565c0'];
        const index = id % bgColors.length;
        return { bg: bgColors[index], text: textColors[index] };
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    };

    const handleAddItem = () => {
        setIsShowSpecies(true);
    };

    const updateItem = async (updatedItem) => {
        try {
            const result = {
                id: updatedItem.speciesId,
                name: updatedItem.editedName,
                categoryId: updatedItem.categoryId,
            };
            const response = await speciesApi.updateSpecies(result);
            console.log(response);
            // Cập nhật UI giả lập
            const newItem = { ...selectedItem, name: updatedItem.editedName };
            setData((prev) => prev.map((item) => (item.id === newItem.id ? newItem : item)));
            setIsShow(false);
        } catch (e) {
            console.error(e);
        }
    };

    const addItem = async (newItem) => {
        console.log(newItem);
        await speciesApi.addSpecies(newItem);
        // Giả lập thêm
        const mockItem = { id: data.length + 1, ...newItem };
        setData([...data, mockItem]);
        setIsShowSpecies(false);
    };

    const deleteItem = async (deletedItem) => {
        if (confirm(`Bạn có chắc muốn xóa loài "${deletedItem.name}"?`)) {
            try {
                await speciesApi.deleteSpecies(deletedItem.id);
                setData((prev) => prev.filter((item) => item.id !== deletedItem.id));
            } catch (e) {
                alert('Xóa không thành công');
            }
        }
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await speciesApi.getAllSpecies();
                if (response?.data?.data) setData(response.data.data);
            } catch (error) {
                console.log('Sử dụng dữ liệu mẫu');
            }
        };
        fetch();
    }, []);

    return (
        <div className={styles['wrapper']}>
            {/* Modal Components */}
            {isShow && (
                <ModalSpecies
                    setIsShow={setIsShow}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    updateItem={updateItem}
                />
            )}
            {isShowSpecies && <ModalAppSpecies setIsShow={setIsShowSpecies} addItem={addItem} />}

            <div className={styles['container']}>
                {/* Header */}
                <div className={styles['header']}>
                    <div className={styles['header-title']}>
                        <h2>Quản lý Loài</h2>
                        <p>Danh sách các loài vật nuôi</p>
                    </div>
                    <button className={styles['btn-add']} onClick={handleAddItem}>
                        <i className="fa-solid fa-plus"></i> Thêm mới
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
                            placeholder="Tìm kiếm tên loài..."
                        />
                    </div>
                    <div className={styles['stats']}>
                        Tổng số: <strong>{data.length}</strong> loài
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
                        {filterData.length === 0 ? (
                            <div className={styles['empty-state']}>
                                <i className="fa-solid fa-frog"></i>
                                <p>Không tìm thấy dữ liệu</p>
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
                                        <div className={styles['td-item']} style={{ width: columns[0].width }}>
                                            <span className={styles['id-badge']}>#{item.id}</span>
                                        </div>

                                        <div className={styles['td-item']} style={{ width: columns[1].width }}>
                                            <div className={styles['species-info']}>
                                                <div
                                                    className={styles['avatar']}
                                                    style={{ background: colors.bg, color: colors.text }}
                                                >
                                                    {getFirstLetter(item.name)}
                                                </div>
                                                <span className={styles['name-text']}>{item.name}</span>
                                            </div>
                                        </div>

                                        <div className={styles['td-item']} style={{ width: columns[2].width }}>
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
                                                        deleteItem(item);
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

export default Species;
