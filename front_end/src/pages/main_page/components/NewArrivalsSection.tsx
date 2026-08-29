import { newArrivalProducts } from "../data/products";
import ProductCard from "./ProductCard";

import "./css/NewArrivalsSection.css";

export default function NewArrivalsSection() {
    return (
        <section className="new-arrivals">
            <header className="new-arrivals__header">
                <p>New arrivals</p>
                <h2>새롭게 만나는 웨딩 컬렉션</h2>
            </header>

            <div className="new-arrivals__grid">
                {newArrivalProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}