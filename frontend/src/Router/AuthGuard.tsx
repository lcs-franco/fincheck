import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }: AuthGuardProps) {
  const signedIn = false;

  if (!signedIn && isPrivate) {
    // Se não estiver logado e a rota for privada, retorne para a página de login
    return <Navigate to="/login" replace />;
  }

  if (signedIn && !isPrivate) {
    // Se estiver logado e a rota for pública, retorne para a página inicial (dashboard)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
