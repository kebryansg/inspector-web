export interface FormDataResolver {
  idForm: number,
  data: any,
  configs: {
    sections: any[],
    components: any[],
  }
}
