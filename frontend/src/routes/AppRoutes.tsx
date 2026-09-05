import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { OrientadorLayout } from '../features/orientador/pages/OrientadorLayout';
import { IncidentesPage } from '../features/orientador/pages/IncidentesPage';
import { ExpedienteUnicoPage } from '../features/orientador/pages/ExpedienteUnicoPage';
import { PlanesIntervencionPage } from '../features/orientador/pages/PlanesIntervencionPage';
import { AsistenteIaPage } from '../features/orientador/pages/AsistenteIaPage';
import { RectorLayout } from '../features/rectoria/pages/RectorLayout';
import { RectorDashboardPage } from '../features/rectoria/pages/RectorDashboardPage';
import { CargaMatriculasPage } from '../features/matriculas/pages/CargaMatriculasPage';
import { AuditoriaForensePage } from '../features/rectoria/pages/AuditoriaForensePage';
import { RectorReportesPage } from '../features/rectoria/pages/RectorReportesPage';
import { FaltasGravesPage } from '../features/rectoria/pages/FaltasGravesPage';
import { RoleGuard } from '../core/auth/RoleGuard';
import { useAuthStore } from '../core/auth/useAuthStore';

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
        <Route path="matriculas" element={<CargaMatriculasPage />} />
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
      </Route>

      {/* Redireccion de Raiz y 404 */}
      <Route path="/" element={getRootRedirect()} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};