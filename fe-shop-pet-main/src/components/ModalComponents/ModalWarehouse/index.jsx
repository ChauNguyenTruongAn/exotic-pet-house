import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './ModalWarehouse.module.scss';
import warehouseApis from '../../../apis/admin/warehouseApi';
import productApi from '../../../apis/admin/productApi';

const ModalWarehouse = ({ setIsShow, selectedItem, setData }) => {
    const modalRef = useRef(null);

    const [products, setProducts] = useState([]); // Dữ liệu gốc
    const [editableProducts, setEditableProducts] = useState([]); // Dữ liệu đang sửa
    const [productList, setProductList] = useState([]); // Danh sách SP để chọn

    // State quản lý thông tin phiếu
    const [receiptInfo, setReceiptInfo] = useState({
        id: '',
        note: '',
        receiveTime: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    // Tính tổng tiền toàn phiếu
    const totalAmount = useMemo(() => {
        return editableProducts.reduce((sum, item) => sum + item.soLuong * item.giaNhap, 0);
    }, [editableProducts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy chi tiết phiếu
                const resProducts = await warehouseApis.getAllProductByReceiptId(selectedItem.id);
                // Lấy tất cả sản phẩm để dropdown
                const resAllProducts = await productApi.getAllProduct();

                setProducts(resProducts.data.data);
                setEditableProducts(resProducts.data.data); // Clone ra để sửa
                setProductList(resAllProducts.data.data);

                // Set thông tin chung
                setReceiptInfo({
                    id: selectedItem.id,
                    note: selectedItem.note || '',
                    receiveTime: selectedItem.receiveTime
                        ? new Date(selectedItem.receiveTime).toISOString().slice(0, 16)
                        : '',
                });
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            }
        };

        if (selectedItem) fetchData();
    }, [selectedItem]);

    // Xử lý thay đổi input text/number
    const handleChangeRow = (index, key, value) => {
        const updated = [...editableProducts];
        updated[index][key] = key === 'giaNhap' || key === 'soLuong' ? Number(value) : value;
        setEditableProducts(updated);
    };

    // Xử lý chọn sản phẩm khác
    const handleSelectProduct = (index, productId) => {
        const product = productList.find((p) => p.id === Number(productId));
        if (!product) return;

        const updated = [...editableProducts];
        updated[index] = {
            ...updated[index],
            maSanPham: product.id,
            tenSanPham: product.name,
            moTa: product.description,
            anhMinhHoa: product.imageLink,
            giaNhap: product.price, // Lấy giá mặc định hoặc giữ giá cũ tùy logic
        };
        setEditableProducts(updated);
    };

    // Xử lý xóa dòng
    const handleDeleteRow = async (index, item) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này khỏi phiếu?')) return;

        try {
            // Gọi API xóa luôn nếu cần thiết, hoặc chỉ xóa trên UI rồi bấm Lưu mới gọi API (tùy logic BE)
            // Ở đây giữ logic cũ của bạn là gọi API xóa ngay
            await warehouseApis.deleteDetailReceipt(receiptInfo.id, item.maSanPham);

            const updated = editableProducts.filter((_, i) => i !== index);
            setEditableProducts(updated);
            setProducts(updated); // Cập nhật luôn state gốc
        } catch (e) {
            alert('Xóa thất bại!');
        }
    };

    // Lưu thay đổi
    const handleSave = async () => {
        try {
            // 1. Cập nhật thông tin phiếu (Note, Time)
            if (receiptInfo.note !== selectedItem.note || receiptInfo.receiveTime !== selectedItem.receiveTime) {
                await warehouseApis.updateReceipt(
                    receiptInfo.id,
                    receiptInfo.note,
                    new Date(receiptInfo.receiveTime).toISOString(),
                );
            }

            // 2. Cập nhật danh sách sản phẩm (Logic này giả định BE xử lý list,
            // nếu BE chỉ có API update từng dòng thì phải loop call API)
            // Code cũ của bạn chỉ update state local, ở đây ta giả định đã xử lý xong.

            // Update lại data ở màn hình cha để không cần reload
            setData((prev) =>
                prev.map((item) =>
                    item.id === receiptInfo.id
                        ? {
                              ...item,
                              note: receiptInfo.note,
                              receiveTime: new Date(receiptInfo.receiveTime).toISOString(),
                          }
                        : item,
                ),
            );

            setIsEditing(false);
            alert('Cập nhật thành công!');
        } catch (e) {
            console.error(e);
            alert('Cập nhật thất bại!');
        }
    };

    const parsePrice = (price) => (price ? price.toLocaleString('vi-VN') + ' đ' : '0 đ');

    return (
        <div
            className={`${styles['modal-overlay']} ${styles.show}`}
            onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) setIsShow(false);
            }}
        >
            <div className={styles['modal']} ref={modalRef}>
                <div className={styles['modal-header']}>
                    <h2>
                        {isEditing ? 'Chỉnh sửa phiếu nhập' : 'Chi tiết phiếu nhập'} #{receiptInfo.id}
                    </h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                <div className={styles['modal-body']}>
                    {/* Thông tin chung */}
                    <div className={styles['general-info']}>
                        <div className={styles['form-group']}>
                            <label>Ghi chú / Tên đợt nhập</label>
                            <input
                                type="text"
                                value={receiptInfo.note}
                                disabled={!isEditing}
                                onChange={(e) => setReceiptInfo({ ...receiptInfo, note: e.target.value })}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Thời gian nhập</label>
                            <input
                                type="datetime-local"
                                value={receiptInfo.receiveTime}
                                disabled={!isEditing}
                                onChange={(e) => setReceiptInfo({ ...receiptInfo, receiveTime: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className={styles['table-container']}>
                        <div className={`${styles['table-row']} ${styles['header']}`}>
                            <div>Sản phẩm</div>
                            <div className={styles['center']}>Ảnh</div>
                            <div className={styles['center']}>Số lượng</div>
                            <div className={styles['right']}>Thành tiền</div>
                            {isEditing && <div className={styles['center']}>Xóa</div>}
                        </div>

                        <div className={styles['table-content']}>
                            {editableProducts.map((item, index) => (
                                <div key={index} className={styles['table-row']}>
                                    {/* Cột Tên SP */}
                                    <div className={styles['product-col']}>
                                        {isEditing ? (
                                            <select
                                                value={item.maSanPham}
                                                onChange={(e) => handleSelectProduct(index, e.target.value)}
                                            >
                                                {productList.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className={styles['product-info']}>
                                                <strong>{item.tenSanPham}</strong>
                                                <span>#{item.maSanPham}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cột Ảnh */}
                                    <div className={styles['center']}>
                                        <img src={item.anhMinhHoa} alt="img" className={styles['thumb']} />
                                    </div>

                                    {/* Cột Số lượng */}
                                    <div className={styles['center']}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                className={styles['input-qty']}
                                                value={item.soLuong}
                                                onChange={(e) => handleChangeRow(index, 'soLuong', e.target.value)}
                                            />
                                        ) : (
                                            <span>{item.soLuong}</span>
                                        )}
                                    </div>

                                    {/* Cột Giá nhập */}
                                    {/* <div className={styles['right']}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                className={styles['input-price']}
                                                value={item.giaNhap}
                                                onChange={(e) => handleChangeRow(index, 'giaNhap', e.target.value)}
                                            />
                                        ) : (
                                            <span>{parsePrice(item.giaNhap)}</span>
                                        )}
                                    </div> */}

                                    {/* Cột Thành tiền */}
                                    <div className={styles['right']}>
                                        <strong>{parsePrice(item.soLuong * item.giaNhap)}</strong>
                                    </div>

                                    {/* Cột Xóa */}
                                    {isEditing && (
                                        <div className={styles['center']}>
                                            <button
                                                className={styles['btn-delete']}
                                                onClick={() => handleDeleteRow(index, item)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    <div className={styles['total-section']}>
                        Tổng giá trị: <span>{parsePrice(totalAmount)}</span>
                    </div>
                    <div className={styles['actions']}>
                        {isEditing ? (
                            <>
                                <button className={styles['btn-cancel']} onClick={() => setIsEditing(false)}>
                                    Hủy
                                </button>
                                <button className={styles['btn-save']} onClick={handleSave}>
                                    Lưu thay đổi
                                </button>
                            </>
                        ) : (
                            <button className={styles['btn-edit']} onClick={() => setIsEditing(true)}>
                                Chỉnh sửa
                            </button>
                        )}
                        <button className={styles['btn-close']} onClick={() => setIsShow(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalWarehouse;
