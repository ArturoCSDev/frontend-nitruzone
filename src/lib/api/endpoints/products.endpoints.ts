export const INVENTORY_ENDPOINTS = {
    TAMANOS: {
        ID: '/inventory/tamanos/:id',
        GET_ALL: '/inventory/tamanos',
        GET_BY_VOLUME: '/inventory/tamanos/volumen/:min/:max',
    },
    PRODUCTOS: {
        ID: '/inventory/productos/:id',
        GET_ALL: '/inventory/productos',
        POST: '/inventory/productos',
        PUT: '/inventory/productos/:id',
        DELETE: '/inventory/productos/:id',
    },
    CATEGORIAS: {
        ID: '/inventory/categorias/:id',
        GET_ALL: '/inventory/categorias',
        GET_BY_TYPE: '/inventory/categorias/tipo/:tipoProducto',
    },
    SABORES: {
        ID: '/inventory/sabores/:id',
        GET_ALL: '/inventory/sabores',
        POST: '/inventory/sabores',
        PUT: '/inventory/sabores/:id',
        DELETE: '/inventory/sabores/:id',
    },
} as const;