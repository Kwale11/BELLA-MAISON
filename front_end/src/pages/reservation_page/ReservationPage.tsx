import ReservationActions from "./components/ReservationActions";
import ReservationHero from "./components/ReservationHero";
import StoreInformation from "./components/StoreInformation";
import { bellaMaisonStore } from "./data/store";

import "./ReservationPage.css";

export default function ReservationPage() {
    return (
        <main className="reservation-page">
            <ReservationHero store={bellaMaisonStore} />

            <ReservationActions store={bellaMaisonStore} />

            <StoreInformation store={bellaMaisonStore} />
        </main>
    );
}