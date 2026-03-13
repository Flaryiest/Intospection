import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom'
import {Home} from '@pages/home/home.tsx'

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Home />} />
))

export default router