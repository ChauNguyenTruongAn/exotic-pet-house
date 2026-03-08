package com.example.be_shop_pet.model.EmbeddedId;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserPromotionId implements Serializable {
    @Column(name = "ma_khuyen_mai")
    private Long promotionId;
    @Column(name = "ma_nguoi_dung")
    private Long userId;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserPromotionId that = (UserPromotionId) o;
        return Objects.equals(promotionId, that.promotionId) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(promotionId, userId);
    }
}
