import { createRouter, createWebHistory } from 'vue-router';
import BookshelfView from '../views/BookshelfView.vue';
import CatalogView from '../views/CatalogView.vue';
import WishlistView from '../views/WishlistView.vue';

const routes = [
  {
    path: '/',
    redirect: '/estante'
  },
  {
    path: '/estante',
    name: 'Bookshelf',
    component: BookshelfView
  },
  {
    path: '/livros',
    name: 'Catalog',
    component: CatalogView
  },
  {
    path: '/comprar',
    name: 'Wishlist',
    component: WishlistView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
