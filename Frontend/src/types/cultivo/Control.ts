export interface Control {
    id?: number;
    afeccion_id: number;
    tipo_control_id: number;
    producto_id: number;
    descripcion: string;
    fecha_control: string;
    responsable_id: number;
    efectividad: number;
    observaciones: string;
  }
  
  export interface ControlDetalle {
    id: number;
    descripcion: string;
    fecha_control: string;
    efectividad: number;
    observaciones: string;
    afeccion: {
      id: number;
      nombre: string;
    };
    tipo_control: {
      id: number;
      nombre: string;
    };
    producto: {
      id: number;
      nombre: string;
    };
    responsable: {
      id: number;
      nombre: string;
      email: string;
    };
  }