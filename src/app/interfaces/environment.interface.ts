export interface EnvironmentInt {
  production: boolean,
  apiUrl: string,
  ambiente?: 'DEVELOPMENT' | "STAGING" | "PRODUCTION",
  googleMapsKey: string,
  apiUrlAnexos: string,
}
