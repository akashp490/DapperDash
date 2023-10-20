import './checlout.styles.scss'

import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

const Checkout = () => {
    const { cartItems, addItemToCart } = useContext(CartContext);

    return(
        <div>
            <h1>I am the Checkout page</h1>
            <div>
                {
                    cartItems.map((cartItem) => {
                        const {id, name, quantity } = cartItem;
                        return (
                        <div key={id}>
                            <h2>{name}</h2>
                            <span>{quantity}</span>
                            <span>decrement</span>
                            <span>increment</span>
                        </div>);
                    })
                }
            </div>
        </div>
    );
};

export default Checkout;