import { Review } from "../pages/Review";
import { Admin } from "../pages/Admin";
import { Home } from "../pages/Home";
import { Main } from "../pages/Main";
import { Search } from "../pages/Search";
import { ADMIN_ROUTE, HOME_ROUTE, MAIN_ROUTE, REVIEW_ROUTE, SEARCH_ROUTE } from "../utils/consts";


export const authRotes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin/>
    },
    {
        path: HOME_ROUTE + '/:id',
        element: <Home/>,
    },
    {
        path: '/*',
        element: <Main/>
    }
];

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        element: <Main/>
    },
    {
        path: REVIEW_ROUTE + '/:id',
        element: <Review/>
    },
    {
        path: SEARCH_ROUTE,
        element: <Search/>
    },
    {
        path: '/*',
        element: <Main/>
    }
];