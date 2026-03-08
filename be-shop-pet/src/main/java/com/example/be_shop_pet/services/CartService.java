package com.example.be_shop_pet.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.Cart;
import com.example.be_shop_pet.model.CartDetail;
import com.example.be_shop_pet.model.Product;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.model.EmbeddedId.CartProductId;
import com.example.be_shop_pet.repo.CartDetailRepository;
import com.example.be_shop_pet.repo.CartRepository;
import com.example.be_shop_pet.repo.ProductRepository;
import com.example.be_shop_pet.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartDetailRepository cartDetailRepository;

    public Cart createCart(Long userId) {
        Cart cart = new Cart();

        if (userId == null) {
            throw new InvalidArgument("Không tìm thấy mã người dùng với id: " + userId + " trong người dùng");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        cart.setUser(user);

        return cartRepository.save(cart);
    }

    public Cart getCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giỏ hàng"));
    }

    public List<CartDetail> getCartDetail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thayas gio hàng với id: " + user.getId()));

        List<CartDetail> cartDetails = cartDetailRepository.findByIdCartId(cart.getId());

        return cartDetails;
    }

    public List<CartDetail> addProductToCart(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new InvalidArgument("Số lượng phải lớn hơn 0");
        }

        Cart cart = getCart();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        // // check tồn kho
        // if (quantity > product.get()) {
        // throw new InvalidArgument("Số lượng vượt quá tồn kho");
        // }

        CartDetail cartDetail = cartDetailRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if (cartDetail != null) {
            int newQuantity = cartDetail.getQuantity() + quantity;

            // // check tồn kho after add
            // if (newQuantity > product.getStock()) {
            // throw new InvalidArgument("Số lượng vượt quá tồn kho");
            // }

            cartDetail.setQuantity(newQuantity);
            cartDetailRepository.save(cartDetail);
        } else {
            CartDetail newCartDetail = CartDetail.builder()
                    .id(new CartProductId(productId, cart.getId()))
                    .product(product)
                    .cart(cart)
                    .quantity(quantity)
                    .build();

            cartDetailRepository.save(newCartDetail);
        }

        return cartDetailRepository.findByIdCartId(cart.getId());
    }

    public List<CartDetail> updateProductInCart(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new InvalidArgument("Số lượng phải lớn hơn 0");
        }

        Cart cart = getCart();

        CartDetail cartDetail = cartDetailRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không có trong giỏ"));

        // Product product = cartDetail.getProduct();

        // if (quantity > product.getStock()) {
        // throw new InvalidArgument("Số lượng vượt quá tồn kho");
        // }

        cartDetail.setQuantity(quantity);
        cartDetailRepository.save(cartDetail);
        return cartDetailRepository.findByIdCartId(cart.getId());
    }

    @Transactional
    public void clearCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giỏ hàng với id: " + user.getId()));
        cartDetailRepository.deleteAllByIdCartId(cart.getId());
    }

    public void deleteProductInCart(Long productId) {
        Cart cart = getCart();

        CartDetail cartDetail = cartDetailRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không có trong giỏ"));

        cartDetailRepository.delete(cartDetail);
    }

}
