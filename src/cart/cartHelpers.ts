import { CartData, CartItemData } from "./cartData";
import { ShopProductEntity, ShopProductVariantEntity } from "../content/entities";


export class CartHelpers {
    static addItem(cart: CartData, data: {
        product: ShopProductEntity,
        quantity: number,
        variant?: ShopProductVariantEntity
    }) {

        const price = CartHelpers.calculPrice(data.product, data.variant);

        const item: CartItemData = {
            id: data.product.id,
            product: data.product,
            quantity: data.quantity,
            variant: data.variant,
            variantId: data.variant && data.variant.id,
            price,
            total: price * data.quantity,
        }

        const existItem = cart.items.find(it => it.id === item.id && it.variantId === item.variantId);
        if (existItem) {
            existItem.quantity += item.quantity;
            existItem.total = existItem.price * existItem.quantity;
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
        cart.total = 0;

        cart.items.forEach(item => {
            cart.quantity += item.quantity;
            cart.total += item.total;
        });
    }

    static calculPrice(product: ShopProductEntity, variant?: ShopProductVariantEntity) {
        const price = variant && variant.price || product.price;

        return price;
    }
}
