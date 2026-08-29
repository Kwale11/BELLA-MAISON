import { useMemo, useState } from "react";

import { collectionProducts } from "../data/products";

import type {
    CollectionFiltersState,
    CollectionSort,
    ProductCategory,
    ProductMaterial,
} from "../types/product";

const initialFilters: CollectionFiltersState = {
    category: "all",
    material: "all",
};

export default function useCollectionFilters() {
    const [filters, setFilters] =
        useState<CollectionFiltersState>(initialFilters);

    const [sort, setSort] =
        useState<CollectionSort>("recommended");

    const filteredProducts = useMemo(() => {
        const products = collectionProducts.filter((product) => {
            const matchesCategory =
                filters.category === "all" ||
                product.category === filters.category;

            const matchesMaterial =
                filters.material === "all" ||
                product.material === filters.material;

            return matchesCategory && matchesMaterial;
        });

        return products.sort((first, second) => {
            switch (sort) {
                case "newest":
                    return (
                        new Date(second.releasedAt).getTime() -
                        new Date(first.releasedAt).getTime()
                    );

                case "price-low":
                    return first.price - second.price;

                case "price-high":
                    return second.price - first.price;

                case "recommended":
                default:
                    return (
                        first.recommendedOrder -
                        second.recommendedOrder
                    );
            }
        });
    }, [filters, sort]);

    const setCategory = (
        category: ProductCategory | "all",
    ) => {
        setFilters((previous) => ({
            ...previous,
            category,
        }));
    };

    const setMaterial = (
        material: ProductMaterial | "all",
    ) => {
        setFilters((previous) => ({
            ...previous,
            material,
        }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const hasActiveFilters =
        filters.category !== "all" ||
        filters.material !== "all";

    return {
        filters,
        sort,
        filteredProducts,
        hasActiveFilters,
        setCategory,
        setMaterial,
        setSort,
        resetFilters,
    };
}