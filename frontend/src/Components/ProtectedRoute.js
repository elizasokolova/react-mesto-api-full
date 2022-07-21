import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({isLogin, component: Main, ...props}){
    return(
        <Route>
            {isLogin ? <Main {...props}/> : <Redirect to="/signin"/>}
        </Route>
    )
}