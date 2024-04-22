export interface Vehicle {
  ID: number;
  brand: string;
  model: string;
  license: string;
  color_primary: string;
  color_second: string;
  state: string;
}

export interface VehicleView {
  id:               number;
  identify_vehicle: string;
  year_manufacture: string;
  previous_plate:   string;
  current_plate:    string;
  count_passengers: number;
  chassis:          string;
  tonnage:          string;
  entity:           string;
  type:             string;
  brand:            string;
  class:            string;
  model:            string;
  state:            string;
  entity_id:        number;
  type_id:          number;
  brand_id:         number;
  class_id:         number;
  model_id:         number;
  color_one_id:     number;
  color_two_id:     number;
}

