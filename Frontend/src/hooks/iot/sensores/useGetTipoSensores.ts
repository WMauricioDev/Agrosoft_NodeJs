import { useQuery } from '@tanstack/react-query';
import api from '@/components/utils/axios';
import { addToast } from '@heroui/react';
import { TipoSensor } from '@/types/iot/type';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/iot/tiposensor/`;

const fetchTipoSensores = async (): Promise<TipoSensor[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('[useGetTipoSensores] No se encontró el token de autenticación.');
    addToast({
      title: 'Sesión expirada',
      description: 'Por favor, inicia sesión nuevamente.',
      timeout: 5000,
      color: 'danger',
    });
    throw new Error('No se encontró el token de autenticación.');
  }

  console.log('[useGetTipoSensores] Enviando GET a:', API_URL);
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[useGetTipoSensores] Respuesta:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[useGetTipoSensores] Error en GET:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage =
      error.response?.data?.detail ||
      Object.entries(error.response?.data || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') ||
      'Error al cargar los tipos de sensores.';
    addToast({
      title: 'Error',
      description: errorMessage,
      timeout: 5000,
      color: 'danger',
    });
    throw error;
  }
};

export const useGetTipoSensores = () => {
  return useQuery<TipoSensor[], Error>({
    queryKey: ['tipoSensores'],
    queryFn: fetchTipoSensores,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};