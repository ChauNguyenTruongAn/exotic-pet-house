package com.example.be_shop_pet.repo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.be_shop_pet.dtos.interfaces.DetailReceiptDto;
import com.example.be_shop_pet.model.WarehouseReceiptDetail;
import com.example.be_shop_pet.model.EmbeddedId.WarehouseReceiptDetailId;

public interface WarehouseReceiptDetailRepository
        extends JpaRepository<WarehouseReceiptDetail, WarehouseReceiptDetailId> {

    @Query(value = """
            SELECT
                phieu_nhap_chi_tiet.ma_phieu_nhap,
                phieu_nhap_chi_tiet.ma_san_pham,
                so_luong,
                ten_san_pham,
                san_pham.gia_ban as gia_nhap,
                mo_ta,
                anh_minh_hoa,
                gia_ban
            FROM phieu_nhap_chi_tiet
            JOIN san_pham
                ON phieu_nhap_chi_tiet.ma_san_pham = san_pham.ma_san_pham
            WHERE ma_phieu_nhap = :ma_phieu_nhap
                    """, nativeQuery = true)
    List<DetailReceiptDto> findAllProductByReceiptId(@Param("ma_phieu_nhap") Long id);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE phieu_nhap_chi_tiet
            SET
                ma_san_pham = :newProductId,
                so_luong = :quantity
            WHERE
                ma_san_pham = :productId AND ma_phieu_nhap = :receiptId
                """, nativeQuery = true)
    int updateDetailReceiptVoid(
            @Param("productId") Long productId,
            @Param("newProductId") Long newProductId,
            @Param("receiptId") Long receiptId,
            @Param("quantity") int quantity);

    @Modifying
    @Transactional
    int deleteByIdProductIdAndIdReceiptId(Long productId, Long receiptId);

    Optional<List<WarehouseReceiptDetail>> findByIdReceiptId(Long id);
}
