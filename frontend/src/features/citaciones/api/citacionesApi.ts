import {apiClient} from '../../../core/api/apiClient'; import {CrearCitacionData,CitacionResponse} from '../types/citacion.types';
export const citacionesApi={
  crearCitacion:async(data:CrearCitacionData)=>(await apiClient.post<CitacionResponse>('/citaciones',data)).data,
  crear:async(data:CrearCitacionData)=>(await apiClient.post<CitacionResponse>('/citaciones',data)).data,
  listarPorIncidente:async(id:number)=>(await apiClient.get<CitacionResponse[]>(`/citaciones/incidente/${id}`)).data,
};
