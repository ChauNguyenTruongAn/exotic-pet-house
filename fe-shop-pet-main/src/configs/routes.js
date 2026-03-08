export const ROUTES = {
    home: '/',
    about: '/about',
    promotion: '/promotion',
    product: '/product',
    contact: '/contact',
    warranty: '/warranty',
    product_detail: '/product/:id',
    cart: '/cart',
    payment: '/payment',
    order: '/orders/:id',
    order_history: '/order-history',
    profile: '/profile',
    not_found: '*',
};

export const ADMIN_ROUTES = {
    category: 'category',
    species: 'species',
    product: 'product',
    user: 'user',
    promotion: 'promotion',
    receipt: 'receipt',
    inventory: 'inventory',
    not_found: '*',
};

export const ADMIN_ABSOLUTE_ROUTES = {
    category: '/admin/category',
    species: '/admin/species',
    product: '/admin/product',
    user: '/admin/user',
    promotion: '/admin/promotion',
    receipt: '/admin/receipt',
    inventory: '/admin/inventory',
    not_found: '*',
};
