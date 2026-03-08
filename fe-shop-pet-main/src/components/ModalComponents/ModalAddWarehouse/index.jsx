import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './ModalAddWarehouse.module.scss';
import warehouseApis from '../../../apis/admin/warehouseApi';
import productApi from '../../../apis/admin/productApi';

const ModalAddWarehouse = ({ setIsShow, setIsReload }) => {
    const modalRef = useRef(null);
    const [productList, setProductList] = useState([]);

    const [receiptInfo, setReceiptInfo] = useState({
        note: '',
        receiveTime: new Date().toISOString().slice(0, 16),
    });

    // Khởi tạo 1 dòng trống mặc định
    const [rows, setRows] = useState([
        { maSanPham: '', soLuong: 1, giaNhap: 0, tenSanPham: '', anhMinhHoa: '', moTa: '' },
    ]);

    // Tự động tính tổng tiền
    const totalAmount = useMemo(() => {
        return rows.reduce((sum, item) => sum + Number(item.soLuong) * Number(item.giaNhap), 0);
    }, [rows]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await productApi.getAllProduct();
                if (res && res.data) setProductList(res.data.data);
            } catch (error) {
                console.error('Lỗi lấy danh sách sản phẩm:', error);
            }
        };
        fetchAllProducts();
    }, []);

    const handleSelectProduct = (index, productId) => {
        const product = productList.find((p) => p.id === Number(productId));
        if (!product) return;

        const newRows = [...rows];
        newRows[index] = {
            ...newRows[index],
            maSanPham: product.id,
            tenSanPham: product.name,
            anhMinhHoa: product.imageLink,
            moTa: product.description,
            giaNhap: product.price, // Lấy giá mặc định
        };
        setRows(newRows);
    };

    const handleChangeRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = Number(value);
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { maSanPham: '', soLuong: 1, giaNhap: 0, tenSanPham: '', anhMinhHoa: '', moTa: '' }]);
    };

    const handleRemoveRow = (index) => {
        if (rows.length === 1) {
            alert('Cần ít nhất 1 sản phẩm để nhập kho!');
            return;
        }
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleSave = async () => {
        const isValid = rows.every((r) => r.maSanPham && r.soLuong > 0);
        if (!isValid) {
            alert('Vui lòng chọn sản phẩm và số lượng hợp lệ!');
            return;
        }

        try {
            const payload = {
                note: receiptInfo.note,
                receiveTime: new Date(receiptInfo.receiveTime).toISOString(),
                details: rows.map((r) => ({
                    productId: r.maSanPham,
                    quantity: Number(r.soLuong),
                    cost: Number(r.giaNhap),
                })),
            };

            await warehouseApis.createReceipt(payload);
            alert('Tạo phiếu nhập thành công!');
            setIsShow(false);
            if (setIsReload) setIsReload((prev) => !prev);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi tạo phiếu nhập!');
        }
    };

    const parsePrice = (price) => (price ? Number(price).toLocaleString('vi-VN') + ' đ' : '0 đ');

    return (
        <div
            className={`${styles['modal-overlay']} ${styles.show}`}
            onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) setIsShow(false);
            }}
        >
            <div className={styles['modal']} ref={modalRef}>
                {/* --- Header --- */}
                <div className={styles['modal-header']}>
                    <h2>Thêm mới phiếu nhập kho</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body --- */}
                <div className={styles['modal-body']}>
                    {/* Thông tin chung */}
                    <div className={styles['general-info']}>
                        <div className={styles['form-group']}>
                            <label>
                                Tên / Ghi chú đợt nhập <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={receiptInfo.note}
                                onChange={(e) => setReceiptInfo({ ...receiptInfo, note: e.target.value })}
                                placeholder="Ví dụ: Nhập hàng tháng 11..."
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label>Thời gian nhập</label>
                            <input
                                type="datetime-local"
                                value={receiptInfo.receiveTime}
                                onChange={(e) => setReceiptInfo({ ...receiptInfo, receiveTime: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className={styles['table-section']}>
                        <div className={styles['section-header']}>
                            <h3>Chi tiết sản phẩm</h3>
                            <button className={styles['btn-add']} onClick={handleAddRow}>
                                <i className="fa-solid fa-plus"></i> Thêm dòng
                            </button>
                        </div>

                        <div className={styles['table-container']}>
                            {/* Grid Header */}
                            <div className={`${styles['table-row']} ${styles['header']}`}>
                                <div>Sản phẩm</div>
                                <div className={styles['center']}>Ảnh</div>
                                <div className={styles['center']}>Số lượng</div>
                                <div className={styles['right']}>Thành tiền</div>
                                <div className={styles['center']}>Xóa</div>
                            </div>

                            {/* Grid Body */}
                            <div className={styles['table-content']}>
                                {rows.map((item, index) => (
                                    <div key={index} className={styles['table-row']}>
                                        {/* Cột Sản phẩm */}
                                        <div className={styles['product-col']}>
                                            <select
                                                value={item.maSanPham}
                                                onChange={(e) => handleSelectProduct(index, e.target.value)}
                                            >
                                                <option value="">-- Chọn sản phẩm --</option>
                                                {productList.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Cột Ảnh */}
                                        <div className={styles['center']}>
                                            {item.anhMinhHoa ? (
                                                <img src={item.anhMinhHoa} alt="sp" className={styles['thumb']} />
                                            ) : (
                                                <div className={styles['no-thumb']}>IMG</div>
                                            )}
                                        </div>

                                        {/* Cột Số lượng */}
                                        <div className={styles['center']}>
                                            <input
                                                type="number"
                                                min="1"
                                                className={styles['input-qty']}
                                                value={item.soLuong}
                                                onChange={(e) => handleChangeRow(index, 'soLuong', e.target.value)}
                                            />
                                        </div>

                                        {/* Cột Giá nhập */}
                                        {/* <div className={styles['right']}>
                                            <input
                                                type="number"
                                                className={styles['input-price']}
                                                value={item.giaNhap}
                                                onChange={(e) => handleChangeRow(index, 'giaNhap', e.target.value)}
                                            />
                                        </div> */}

                                        {/* Cột Thành tiền */}
                                        <div className={styles['right']}>
                                            <strong>{parsePrice(item.soLuong * item.giaNhap)}</strong>
                                        </div>

                                        {/* Cột Xóa */}
                                        <div className={styles['center']}>
                                            <button
                                                className={styles['btn-delete']}
                                                onClick={() => handleRemoveRow(index)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className={styles['modal-footer']}>
                    <div className={styles['total-section']}>
                        Tổng giá trị: <span>{parsePrice(totalAmount)}</span>
                    </div>
                    <div className={styles['actions']}>
                        <button className={styles['btn-close']} onClick={() => setIsShow(false)}>
                            Hủy bỏ
                        </button>
                        <button className={styles['btn-save']} onClick={handleSave}>
                            Lưu phiếu nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAddWarehouse;
