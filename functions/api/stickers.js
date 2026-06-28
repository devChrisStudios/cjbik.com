var DEFAULT_STICKERS = [
    { id: 'blue-white',   name: 'Blue',   color: 'White', image: 'images/Blue_Sticker.png',   category: 'color' },
    { id: 'blue-black',   name: 'Blue',   color: 'Black', image: 'images/Blue_Sticker.png',   category: 'color' },
    { id: 'red-white',    name: 'Red',    color: 'White', image: 'images/Red_Sticker.png',    category: 'color' },
    { id: 'red-black',    name: 'Red',    color: 'Black', image: 'images/Red_Sticker.png',    category: 'color' },
    { id: 'green-white',  name: 'Green',  color: 'White', image: 'images/Green_Sticker.png',  category: 'color' },
    { id: 'green-black',  name: 'Green',  color: 'Black', image: 'images/Green_Sticker.png',  category: 'color' },
    { id: 'purple-white', name: 'Purple', color: 'White', image: 'images/Purple_Sticker.png', category: 'color' },
    { id: 'purple-black', name: 'Purple', color: 'Black', image: 'images/Purple_Sticker.png', category: 'color' },
    { id: 'orange-white', name: 'Orange', color: 'White', image: 'images/Orange_Sticker.png', category: 'color' },
    { id: 'orange-black', name: 'Orange', color: 'Black', image: 'images/Orange_Sticker.png', category: 'color' },
    { id: 'pink-white',   name: 'Pink',   color: 'White', image: 'images/Pink_Sticker.png',   category: 'color' },
    { id: 'pink-black',   name: 'Pink',   color: 'Black', image: 'images/Pink_Sticker.png',   category: 'color' },
    { id: 'black-white',  name: 'Black',  color: 'White', image: 'images/Black_Sticker.png',  category: 'color' },
    { id: 'grey-white',   name: 'Grey',   color: 'White', image: 'images/Grey_Sticker.png',   category: 'color' }
];

export async function onRequest(context) {
    try {
        if (context.env.DECAL_UPLOADS) {
            var obj = await context.env.DECAL_UPLOADS.get('products/stickers.json');
            if (obj) {
                var text = await obj.text();
                return new Response(text, {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
        }
    } catch (e) {}
    return new Response(JSON.stringify(DEFAULT_STICKERS), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
}
