import { formatPrice } from '../utils/currencyFormat';

export default function Currency({ currency, amount, children }) {

    return (
        <div>
            <p>{formatPrice(amount, currency)}</p>
            <div className="mt-4">
                {children}
            </div>
        </div>
    )
}