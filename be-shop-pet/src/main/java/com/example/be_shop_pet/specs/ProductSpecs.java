package com.example.be_shop_pet.specs;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale.Category;

import org.springframework.data.jpa.domain.Specification;

import com.example.be_shop_pet.model.Product;
import com.example.be_shop_pet.model.Species;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

// nhớ xử lý null
public class ProductSpecs {
    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank())
                return null;

            return cb.like(root.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Product> priceBetween(List<String> ranges) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (String range : ranges) {
                String[] parts = range.split("-");
                Double min = parts[0].equals("null") ? null : Double.valueOf(parts[0]);
                Double max = parts[1].equals("null") ? null : Double.valueOf(parts[1]);

                if (min != null && max != null) {
                    predicates.add(cb.between(root.get("price"), min, max));
                } else if (min != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("price"), min));
                } else if (max != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("price"), max));
                }
            }

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Product> hasSpeciesName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank())
                return null;
            Join<Product, Species> speciesJoin = root.join("species", JoinType.INNER);
            if (query != null)
                query.distinct(true);
            return cb.like(speciesJoin.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Product> hasSpeciesId(List<Long> ids) {
        return (root, query, cb) -> {
            if (ids == null || ids.isEmpty())
                return null;
            return root.get("species").get("id").in(ids);
        };
    }

    public static Specification<Product> hasCategoryId(Long id) {
        return (root, query, cb) -> {
            if (id == null)
                return null;

            Join<Product, Species> speciesJoin = root.join("species", JoinType.INNER);
            Join<Species, Category> categoryJoin = speciesJoin.join("category", JoinType.INNER);

            if (query != null)
                query.distinct(true);
            return cb.equal(categoryJoin.get("id"), id);

            // có thể viết lẹ hơn.
            // return cb.equal(root.get("species").get("category").get("id"), id);
        };
    }
}
