export const fetch_products = async () => {
    try {
        const res = await (await fetch("http://127.0.0.1:8000/allProducts")).json();
        return res;
    } catch (error) {
        console.log(error)
    }
}
export const fetch_categories = async () => {
    try {
        const res = await (await fetch("http://127.0.0.1:8000/allCategories")).json();
        return res;
    } catch (error) {
        console.log(error)
    }
}
export const fetch_productByCategory = async (categoryId) => {
    try {
        const res = await (await fetch(`http://127.0.0.1:8000/allProducts/${categoryId}`)).json();
        return res;
    } catch (error) {
        console.log(error)
    }
}