export type TAnnotation = 'observation' | 'recommendation' | 'disposition';

export interface Annotation {
  id: string;
  idSection: string;
  section?: string;
  type: TAnnotation;
  description: string;
}
