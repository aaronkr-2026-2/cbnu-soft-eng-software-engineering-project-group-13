import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Schedule from "../components/Pages/Schedule/Schedule";
import NoteTaking from "../components/Pages/NoteTaking/NoteTaking";
import Pomodoro from "../components/Pages/Pomodoro/Pomodoro";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        children: [
            {
                path: '/',
                element: <Pomodoro />
            },
            {
                path: '/note',
                element: <NoteTaking />
            },
            {
                path: '/schedule',
                element: <Schedule />
            }
        ]
    }
])

export default router;