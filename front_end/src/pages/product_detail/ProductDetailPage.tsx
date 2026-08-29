import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useLocation,
    useParams,
} from "react-router-dom";

import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInformation from "./components/ProductInformation";
import ProductZoomPreview from "./components/ProductZoomPreview";

import {
    createProductDetail,
    getProductDetail,
} from "./data/productDetails";

import type { CollectionProduct } from "../collection/types/product";
import type { ProductZoomState } from "./types/productDetail";

import "./ProductDetailPage.css";

interface ProductDetailLocationState {
    product?: CollectionProduct;
}

const initialZoomState: ProductZoomState = {
    isActive: false,
    imageUrl: "",
    positionX: 50,
    positionY: 50,
};

export default function ProductDetailPage() {
    const { productSlug } = useParams<{
        productSlug: string;
    }>();

    const location = useLocation();

    const navigationState =
        location.state as ProductDetailLocationState | null;

    const passedProduct = navigationState?.product;

    const [zoom, setZoom] =
        useState<ProductZoomState>(initialZoomState);

    const product = useMemo(() => {
        if (!productSlug) {
            return undefined;
        }

        // 새로고침·직접 접속을 위한 기본 조회
        const storedProduct =
            getProductDetail(productSlug);

        if (storedProduct) {
            return storedProduct;
        }

        // 컬렉션에서 이동할 때 전달받은 데이터
        if (
            passedProduct &&
            passedProduct.slug === productSlug
        ) {
            return createProductDetail(passedProduct);
        }

        return undefined;
    }, [productSlug, passedProduct]);

    useEffect(() => {
        setZoom(initialZoomState);

        window.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, [productSlug]);

    if (!product) {
        return (
            <main className="product-detail-not-found">
                <p>Product not found</p>

                <h1>제품을 찾을 수 없습니다.</h1>

                <Link to="/products">
                    컬렉션으로 돌아가기
                </Link>
            </main>
        );
    }

    return (
        <main className="product-detail-page">
            <ProductBreadcrumb
                productName={product.name}
            />

            <section className="product-detail-page__layout">
                <ProductGallery
                    key={product.slug}
                    images={product.images}
                    onZoomChange={setZoom}
                />

                <div className="product-detail-page__side">
                    <ProductInformation
                        product={product}
                    />

                    <ProductZoomPreview zoom={zoom} />
                </div>
            </section>
        </main>
    );
}