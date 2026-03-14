import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'
import Layout from './Layout'
import { Home } from '@pages/home/home.tsx'
import Artifacts from '@pages/artifacts/artifacts.tsx'
import Experiences from '@pages/experiences/experiences.tsx'
import Writing from '@pages/writing/writing.tsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/artifacts" element={<Artifacts />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/writing" element={<Writing />} />
        </Route>
    )
)

export default router
