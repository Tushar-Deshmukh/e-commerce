/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ProductsController = () => import('#controllers/products_controller')
const UploadController = () => import('#controllers/upload_images_controller')
const RatingsController = () => import('#controllers/ratings_controller')
const WishlistController = () => import('#controllers/wishlists_controller')
const CartController = () => import('#controllers/carts_controller')
const StripeController = () => import('#controllers/payments_controller')
const addressController = () => import('#controllers/address_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

//auth
router.post('/register', [AuthController, 'register'])
router.post('/forgot', [AuthController, 'forgot'])
router.post('/reset', [AuthController, 'reset'])
router.post('/login', [AuthController, 'login'])
router.post('/verify-otp', [AuthController, 'verify'])
router.post('/logout', [AuthController, 'logout']).use([middleware.auth()])
router.put('/update-user/:id', [AuthController, 'updateUser']).use([middleware.auth()])
router.put('/change-password', [AuthController, 'changePassword']).use([middleware.auth()])
router.get('/profile', [AuthController, 'profile']).use([middleware.auth()])

//address
router
  .group(() => {
    router.post('/', [addressController, 'store'])
    router.get('/', [addressController, 'index'])
    router.get('/:id', [addressController, 'getAddress'])
    router.put('/:id', [addressController, 'update'])
    router.delete('/:id', [addressController, 'destroy'])
  })
  .prefix('/address')
  .use([middleware.auth()])

//categories
router.get('/categories', [CategoriesController, 'index']).prefix('/admin/category')
router
  .group(() => {
    router.post('/create-category', [CategoriesController, 'create'])

    router.get('/show-category/:id', [CategoriesController, 'show'])
    router.put('/update-category/:id', [CategoriesController, 'update'])
    router.delete('/delete-category/:id', [CategoriesController, 'destroy'])
  })
  .prefix('/admin/category')
  .use([middleware.auth(), middleware.isAdmin()])

//products
router.get('/get-all-products', [ProductsController, 'index']).prefix('/admin/products')
router.get('/get-product/:id', [ProductsController, 'show']).prefix('/admin/products')
router
  .group(() => {
    router.post('/create-product', [ProductsController, 'create'])
    router.put('/update-product/:id', [ProductsController, 'update'])
    router.delete('/delete-product/:id', [ProductsController, 'destroy'])
  })
  .prefix('/admin/products')
  .use([middleware.auth(), middleware.isAdmin()])

//image upload
router
  .post('/upload/image', [UploadController, 'uploadImage'])
  .use([middleware.auth(), middleware.isAdmin()])

//rating
router.get('/product/:productId', [RatingsController, 'getProductRatings']).prefix('ratings')
router
  .group(() => {
    router.post('/create-rating', [RatingsController, 'create'])
    router.put('/update-rating/:id', [RatingsController, 'update'])
    router.delete('/delete-rating/:id', [RatingsController, 'delete'])
  })
  .prefix('ratings')
  .middleware([middleware.auth()])

//wishlist
router
  .group(() => {
    router.post('/add-to-wishlist', [WishlistController, 'add'])
    router.delete('/remove-from-wishlist/:productId', [WishlistController, 'remove'])
    router.get('/my-wishlist', [WishlistController, 'list'])
    router.get('/wishlisted-products', [WishlistController, 'wishlistedProducts'])
  })
  .prefix('/wishlist')
  .middleware([middleware.auth()])

//cart
router
  .group(() => {
    router.post('', [CartController, 'add']),
      router.get('', [CartController, 'getCartItems']),
      router.delete('/:id', [CartController, 'removeFromCart'])
  })
  .prefix('/cart')
  .middleware([middleware.auth()])

//payment
router
  .post('/create-payment-intent', [StripeController, 'createPaymentIntent'])
  .middleware([middleware.auth()])
