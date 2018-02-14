import { CartData, CartItemData } from "./cartData";


export class CartHelpers {
    static addItem(cart: CartData, item: CartItemData) {
        const existItem = cart.items.find(it => it.id === item.id && it.variantId === item.variantId);
        if (existItem) {
            existItem.quantity += item.quantity;
        } else {
            cart.items.push(item);
        }
        CartHelpers.setTotals(cart);
    }

    static removeItem(cart: CartData, id: string) {
        const index = cart.items.findIndex(it => it.id === id);
        if (index > -1) {
            cart.items.splice(index, 1);
            CartHelpers.setTotals(cart);
        }
    }

    static setTotals(cart: CartData) {
        cart.quantity = 0;
        cart.price = 0;

        cart.items.forEach(item => {
            item.price = item.quantity * item.product.price;

            cart.quantity += item.quantity;
            cart.price += item.price;
        });
    }
}
