import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/organisms/Layout'
import Loading from '@/components/ui/Loading'

const Home = lazy(() => import('@/components/pages/Home'))
const ProductPage = lazy(() => import('@/components/pages/ProductPage'))
const CategoryPage = lazy(() => import('@/components/pages/CategoryPage'))
const SearchPage = lazy(() => import('@/components/pages/SearchPage'))
const CheckoutPage = lazy(() => import('@/components/pages/CheckoutPage'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))

const suspenseWrapper = (Component) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>
    <Component />
  </Suspense>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: suspenseWrapper(Home)
  },
  {
    path: "product/:productId",
    element: suspenseWrapper(ProductPage)
  },
  {
    path: "category/:categorySlug",
    element: suspenseWrapper(CategoryPage)
  },
  {
    path: "search",
    element: suspenseWrapper(SearchPage)
  },
  {
    path: "checkout",
    element: suspenseWrapper(CheckoutPage)
  },
  {
    path: "login",
    element: suspenseWrapper(Login)
  },
  {
    path: "signup",
    element: suspenseWrapper(Signup)
  },
  {
    path: "callback",
    element: suspenseWrapper(Callback)
  },
  {
    path: "error",
    element: suspenseWrapper(ErrorPage)
  },
  {
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: suspenseWrapper(PromptPassword)
  },
  {
    path: "reset-password/:appId/:fields",
    element: suspenseWrapper(ResetPassword)
  },
  {
    path: "*",
    element: suspenseWrapper(NotFound)
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)