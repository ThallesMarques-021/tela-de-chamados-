export interface Call {
  id: number;
  title: string;
  description: string;
  status: 'Aberto' | 'Em Andamento' | 'Fechado';
  createdAt: string;
}
