import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import  Cart  from './Cart';
import { useStateContext } from '../context/StateContext';

export const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/"> FM Headphones</Link>
      </p>
      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
 {/* only want cart to show when showCart is set to true  */}
      {showCart && <Cart />}
    </div>
  )
}
