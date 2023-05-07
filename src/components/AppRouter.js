import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import {Route, Routes} from "react-router-dom";
import { authRotes, publicRoutes } from "../routes/routes"
import { Context } from "..";

export const AppRouter = observer(() => {
    const {user} = useContext(Context);

    return (
        <Routes>
            {user.isAuth && authRotes.map(({path, element}) => 
                <Route key={path} path={path} element={element} />
            )}
            {publicRoutes.map(({path, element}) => 
                <Route key={path} path={path} element={element} />
            )}
        </Routes>
    )
})