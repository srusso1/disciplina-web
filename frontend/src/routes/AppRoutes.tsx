import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleGuard } from '../core/auth/RoleGuard';
import { useAuthStore } from '../core/auth/useAuthStore';
import { PageLoader } from '../core/components/PageLoader';

// Code-splitting mediante lazy loading modular
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const OrientadorLayout = React.lazy(() => import('../features/orientador/pages/OrientadorLayout').then(m => ({ default: m.OrientadorLayout })));
const IncidentesPage = React.lazy(() => import('../features/orientador/pages/IncidentesPage').then(m => ({ default: m.IncidentesPage })));
const ExpedienteUnicoPage = React.lazy(() => import('../features/orientador/pages/ExpedienteUnicoPage').then(m => ({ default: m.ExpedienteUnicoPage })));
const PlanesIntervencionPage = React.lazy(() => import('../features/orientador/pages/PlanesIntervencionPage').then(m => ({ default: m.PlanesIntervencionPage })));
const AsistenteIaPage = React.lazy(() => import('../features/orientador/pages/AsistenteIaPage').then(m => ({ default: m.AsistenteIaPage })));
const RectorLayout = React.lazy(() => import('../features/rectoria/pages/RectorLayout').then(m => ({ default: m.RectorLayout })));
const RectorDashboardPage = React.lazy(() => import('../features/rectoria/pages/RectorDashboardPage').then(m => ({ default: m.RectorDashboardPage })));
const CargaMatriculasPage = React.lazy(() => import('../features/matriculas/pages/CargaMatriculasPage').then(m => ({ default: m.CargaMatriculasPage })));
const AuditoriaForensePage = React.lazy(() => import('../features/rectoria/pages/AuditoriaForensePage').then(m => ({ default: m.AuditoriaForensePage })));
const RectorReportesPage = React.lazy(() => import('../features/rectoria/pages/RectorReportesPage').then(m => ({ default: m.RectorReportesPage })));
const FaltasGravesPage = React.lazy(() => import('../features/rectoria/pages/FaltasGravesPage').then(m => ({ default: m.FaltasGravesPage })));
const ConfiguracionPage = React.lazy(() => import('../features/rectoria/pages/ConfiguracionPage').then(m => ({ default: m.ConfiguracionPage })));

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getRootRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }
    if (user.rol === 'ROLE_RECTOR') {
      return <Navigate to="/rectoria/dashboard" replace />;
    }
    return <Navigate to="/orientador/incidentes" replace />;
  };

  return (
    <Suspense fallback={<PageLoader mensaje="Cargando interfaz..." />}>
      <Routes>
        {/* Ruta Publica */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas - Orientador */}
        <Route
          path="/orientador"
          element={
            <RoleGuard allowedRoles={['ROLE_ORIENTADOR']}>
              <OrientadorLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="incidentes" replace />} />
          <Route path="incidentes" element={<IncidentesPage />} />
          <Route path="expedientes" element={<ExpedienteUnicoPage />} />
          <Route path="planes" element={<PlanesIntervencionPage />} />
          <Route path="asistente-ia" element={<AsistenteIaPage />} />
        </Route>

        {/* Rutas Protegidas - Rectoria */}
        <Route
          path="/rectoria"
          element={
            <RoleGuard allowedRoles={['ROLE_RECTOR']}>
              <RectorLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RectorDashboardPage />} />
          <Route path="matriculas" element={<CargaMatriculasPage />} />
          <Route path="faltas-graves" element={<FaltasGravesPage />} />
          <Route path="auditoria" element={<AuditoriaForensePage />} />
          <Route path="reportes" element={<RectorReportesPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Redireccion de Raiz y 404 */}
        <Route path="/" element={getRootRedirect()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};