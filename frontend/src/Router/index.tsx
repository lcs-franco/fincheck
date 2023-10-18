import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { AuthGuard } from './AuthGuard';
import { Login } from '../view/Login';
import { Register } from '../view/Register';
import { Dashboard } from '../view/Dashboard';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
