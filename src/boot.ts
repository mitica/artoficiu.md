
import { Menu } from './catalog/narbutas/menu';

export default async function boot(): Promise<any> {
    await Menu.boot();
}
