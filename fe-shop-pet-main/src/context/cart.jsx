import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cartApis from '../apis/cartApis';
import { useAuth } from '.';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            setCart([]);
            return;
        }
        const fetch = async () => {
            try {
                const response = await cartApis.getCart();
                setCart(response.data.data || []);
            } catch (error) {
                setCart([]);
            }
            console.log(response.data.data);
        };

        fetch();
    }, [user, loading]);

    const addProductToCart = async (product, quantity = 1) => {
        if (user == null) return toast.error('Vui lòng đăng nhập');
        const response = await cartApis.addProductToCart({ productId: product.id, quantity });
        setCart((prev) => {
            const exists = prev.find((item) => item.id === product.id);

            if (exists) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    product,
                    quantity,
                },
            ];
        });
        toast.success('Đã thêm vào giỏ hàng!');
    };

    const removeProductFromCart = async (id) => {
        await cartApis.deleteProductFromCart(id);
        setCart((prev) => prev.filter((item) => item.product.id !== id));
    };


    const updateProductFromCart = async (id, quantity) => {
        setCart((prev) => prev.map((item) => (item.product.id === id ? { ...item, quantity } : item)));

        try {
            await cartApis.updateProductFromCart({ productId: id, quantity });
        } catch (error) {
            setCart((prev) =>
                prev.map((item) => (item.product.id === id ? { ...item, quantity: item.quantity } : item)),
            );

            alert(error.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const increaseItem = async (id) => {
        const item = cart.find((item) => item.product.id === id);
        if (!item) return;

        try {
            const newQuantity = item.quantity + 1;

            setCart((prev) => prev.map((item) => (item.product.id === id ? { ...item, quantity: newQuantity } : item)));
            await cartApis.updateProductFromCart({
                productId: id,
                quantity: newQuantity,
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể tăng số lượng');
        }
    };

    const decreaseItem = async (id) => {
        const item = cart.find((item) => item.product.id === id);

        if (!item) return;

        try {
            if (item.quantity === 1) {
                setCart((prev) => prev.filter((item) => item.id !== id));
                await cartApis.deleteProductFromCart(id);
            } else {
                const newQuantity = item.quantity - 1;

                setCart((prev) =>
                    prev.map((item) => (item.product.id === id ? { ...item, quantity: newQuantity } : item)),
                );
                await cartApis.updateProductFromCart({
                    productId: id,
                    quantity: newQuantity,
                });
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể giảm số lượng');
        }
    };

    const clearCart = async () => {
        await cartApis.clearCart();
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addProductToCart,
                removeProductFromCart,
                updateProductFromCart,
                increaseItem,
                decreaseItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
