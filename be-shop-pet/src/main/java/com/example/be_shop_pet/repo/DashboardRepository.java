package com.example.be_shop_pet.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.be_shop_pet.dtos.dashboard.LowStockProduct;
import com.example.be_shop_pet.dtos.dashboard.RecentOrderDto;
import com.example.be_shop_pet.dtos.interfaces.CategoryRevenueDto;
import com.example.be_shop_pet.dtos.interfaces.OrderStatusCount;
import com.example.be_shop_pet.dtos.interfaces.RateKpi;
import com.example.be_shop_pet.dtos.interfaces.TopProductDto;
import com.example.be_shop_pet.model.Order;

@Repository
public interface DashboardRepository extends JpaRepository<Order, Integer> {

    // ===================== KPI trạng thái đơn =====================
    @Query(value = """
            SELECT
                (SUM(CASE WHEN trang_thai = 'CANCELLED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS cancelledRate,
                (SUM(CASE WHEN trang_thai = 'CONFIRMED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS confirmedRate
            FROM hoa_don
            """, nativeQuery = true)
    RateKpi getOrderStatusRates();

    // ===================== Đơn hàng gần đây =====================
    @Query(value = """
            SELECT
                hd.ma_hoa_don AS maHoaDon,
                nd.ho_ten AS hoTen,
                hd.tong_tien AS tongTien,
                hd.trang_thai AS trangThai,
                hd.ngay_ban AS ngayBan
            FROM hoa_don hd
            JOIN nguoi_dung nd ON hd.ma_khach_hang = nd.ma_nguoi_dung
            ORDER BY hd.ngay_ban DESC
            """, nativeQuery = true)
    List<RecentOrderDto> getRecentOrders(Pageable pageable);

    // ===================== Lợi nhuận =====================
    @Query(value = """
            WITH tb_loi_nhuan AS (
                SELECT
                    ct.ma_hoa_don,
                    SUM(ct.don_gia * ct.so_luong) AS loi_nhuan
                FROM chi_tiet_hoa_don ct
                JOIN hoa_don hd ON ct.ma_hoa_don = hd.ma_hoa_don
                WHERE hd.ngay_ban BETWEEN :startDate AND :endDate
                  AND hd.trang_thai_thanh_toan = 'PAID' OR hd.trang_thai ('COMPLETED')
                GROUP BY ct.ma_hoa_don
            )
            SELECT SUM(loi_nhuan) FROM tb_loi_nhuan
            """, nativeQuery = true)
    BigDecimal getProfitByDateRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    // ===================== Tổng đơn hàng =====================
    @Query(value = """
            SELECT COUNT(ma_hoa_don)
            FROM hoa_don
            WHERE ngay_ban BETWEEN :startDate AND :endDate
            """, nativeQuery = true)
    Integer getTotalOrdersByDateRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    @Query(value = """
            SELECT COUNT(ma_hoa_don)
            FROM hoa_don
            WHERE DATE(ngay_ban) = :date
            """, nativeQuery = true)
    Integer getTotalOrderByDate(@Param("date") String date);

    // ===================== Tổng user =====================
    @Query(value = "SELECT COUNT(*) FROM nguoi_dung", nativeQuery = true)
    Integer getTotalUser();

    // ===================== Tỉ lệ trạng thái theo thời gian =====================
    @Query(value = """
            SELECT
                (SUM(CASE WHEN trang_thai = 'CANCELLED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS cancelledRate,
                (SUM(CASE WHEN trang_thai = 'CONFIRMED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS confirmedRate
            FROM hoa_don
            WHERE ngay_ban BETWEEN :startDate AND :endDate
            """, nativeQuery = true)
    RateKpi getOrderStatusRatesByDateRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    // ===================== Đếm trạng thái =====================
    @Query(value = """
            SELECT trang_thai AS trangThai, COUNT(ma_hoa_don) AS soLuong
            FROM hoa_don
            GROUP BY trang_thai
            """, nativeQuery = true)
    List<OrderStatusCount> getOrderStatusCount();

    @Query(value = """
            SELECT trang_thai AS trangThai, COUNT(ma_hoa_don) AS soLuong
            FROM hoa_don
            WHERE ngay_ban BETWEEN :startDate AND :endDate
            GROUP BY trang_thai
            """, nativeQuery = true)
    List<OrderStatusCount> getOrderStatusCountByDateRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    // ===================== Sản phẩm sắp hết =====================
    @Query(value = """
            SELECT
                sp.ma_san_pham AS maSanPham,
                sp.ten_san_pham AS tenSanPham,
                sp.anh_minh_hoa AS anhMinhHoa,
                tk.so_luong AS soLuong
            FROM san_pham sp
            JOIN ton_kho tk ON sp.ma_san_pham = tk.ma_san_pham
            WHERE tk.so_luong < :minStock
            ORDER BY tk.so_luong ASC
            """, nativeQuery = true)
    List<LowStockProduct> findLowStockProducts(@Param("minStock") Integer minStock, Pageable pageable);

    // ===================== Top sản phẩm =====================
    @Query(value = """
            SELECT
                sp.ma_san_pham AS productId,
                sp.ten_san_pham AS productName,
                sp.anh_minh_hoa AS imageUrl,
                SUM(ct.so_luong) AS totalSold,
                SUM(ct.don_gia * ct.so_luong) AS revenue
            FROM chi_tiet_hoa_don ct
            JOIN san_pham sp ON ct.ma_san_pham = sp.ma_san_pham
            JOIN hoa_don hd ON ct.ma_hoa_don = hd.ma_hoa_don
            WHERE hd.ngay_ban BETWEEN :startDate AND :endDate
              AND hd.trang_thai_thanh_toan = 'PAID' AND hd.trang_thai IN ('CONFIRMED', 'COMPLETED')
            GROUP BY sp.ma_san_pham, sp.ten_san_pham, sp.anh_minh_hoa
            ORDER BY totalSold DESC
            """, nativeQuery = true)
    List<TopProductDto> getTopSellingProducts(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            Pageable pageable);

    // ===================== Doanh thu theo danh mục =====================
    @Query(value = """
            SELECT
                c.ten_danh_muc AS categoryName,
                SUM(ct.don_gia * ct.so_luong) AS revenue,
                COUNT(DISTINCT hd.ma_hoa_don) AS orderCount
            FROM chi_tiet_hoa_don ct
            JOIN san_pham sp ON ct.ma_san_pham = sp.ma_san_pham
            JOIN loai l ON sp.ma_loai = l.ma_loai
            JOIN danh_muc c ON l.ma_danh_muc = c.ma_danh_muc
            JOIN hoa_don hd ON ct.ma_hoa_don = hd.ma_hoa_don
            WHERE hd.ngay_ban BETWEEN :startDate AND :endDate
              AND hd.trang_thai_thanh_toan = 'PAID' AND hd.trang_thai IN ('CONFIRMED', 'COMPLETED')
            GROUP BY c.ten_danh_muc
            ORDER BY revenue DESC
            """, nativeQuery = true)
    List<CategoryRevenueDto> getRevenueByCategory(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);
}