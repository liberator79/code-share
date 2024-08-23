import React from "react"
import ReaactDom from "react-dom/client"
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom"
import Room from "./components/Room"
import Welcome from "./components/Welcome"
import "./index.css"
const Layout = () => {
    return (

        <div>
            <Outlet />
        </div>

    )
}


const router = createBrowserRouter([
    {


        children: [
            {
                path: "/",
                element: <Welcome />,
            },
            {
                path: "/room/:roomid",
                element: <Room />
            }
        ]
    }
])

const root = ReaactDom.createRoot(document.getElementById("root"))
root.render(<RouterProvider router={router} />)