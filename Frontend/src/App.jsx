import { RouterProvider } from "react-router-dom"
import router from "./Routes/Routes"
import { PomodoroProvider } from './context/PomodoroContext';

function App() {

  return (
    <>
      <PomodoroProvider>
        <RouterProvider router={router}></RouterProvider>
      </PomodoroProvider>
    </>
  )
}

export default App
