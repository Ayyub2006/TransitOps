import { fetchApi } from './api';

export const getKPIs = () => fetchApi('/dashboard/kpis');
export const getMapData = () => fetchApi('/dashboard/map');
