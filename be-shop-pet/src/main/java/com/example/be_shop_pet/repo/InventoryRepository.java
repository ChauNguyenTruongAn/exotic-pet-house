package com.example.be_shop_pet.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.be_shop_pet.model.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query(value = """
            SELECT tk.ma_san_pham,tk.so_luong,sp.ten_san_pham,sp.mo_ta,sp.anh_minh_hoa,sp.gia_ban,
            sp.ma_loai
            FROM ton_kho tk
            JOIN san_pham sp
            ON tk.ma_san_pham=sp.ma_san_pham
                """, nativeQuery = true)

    List<Object[]> getInventoryWithProduct();

    @Query(value = "SELECT * FROM ton_kho WHERE ma_san_pham IN (:productIds)", nativeQuery = true)
    List<Inventory> findByProductIds(@Param("productIds") List<Long> productIds);
}
