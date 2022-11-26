import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; //pop up notification

const Context = createContext();

export const StateContext = ({ children }) => { 
//whenever we call state context will be considered children and we can render it out
    const [showCart, setShowCart] = useState(false); // to show the cart
    
    const [cartItems, setCartItems] = useState([]); // need to know which cart items in the cart, will be filled with data from locale storage(so if user leaves page and comes back it will maintain the state)

    const [totalPrice, setTotalPrice] = useState(0);

    const [totalQuantities, setTotalQuantities] = useState(0); // to know quantity of all items

    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        // first check if there is already this item in the cart then adjust qty and price
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
        
        if(checkProductInCart) {
            // if we adding an item that already exists in cart
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);

        } else { //if item does not already exist in cart
            product.quantity  = quantity;

            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to cart.`);
    }

    const onRemove = (product) => {
        // first must identify which product we're removing(the found product)
        foundProduct = cartItems.find((item) => item._id === product._id)
        //copy cart items to create a version of new cart items without the cart item we're currently updating
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
        

    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        // go through cart items and find one individual item and check if it has the product id
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id);

        if(value === 'inc' ) {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1}]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);
        } else if (value === 'dec') { 
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1}]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
            };
        }
    }


// Instead of passing setQty to the value object below, we create dynamic qty update functions
// inside the state context so that way we provide just the final function to the product details component

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    }
    

    return (
        <Context.Provider
            value={{ //can access these state values from any component now
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
            }}
        >
            {children}
        </Context.Provider>
    )


}

//fx to grab the state so we can import useStateContext in the slug.js 
export const useStateContext = () => useContext(Context);