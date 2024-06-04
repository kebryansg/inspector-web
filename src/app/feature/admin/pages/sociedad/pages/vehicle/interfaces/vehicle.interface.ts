export interface Vehicle {
  ID: number;
  brand: string;
  model: string;
  license: string;
  color_primary: string;
  color_second: string;
  state: string;
}

export interface VehicleEntity {
  ID:               number;
  state:            string;
  user_ins:         number;
  user_upd:         null;
  created_at:       Date;
  updated_at:       null;
  identify_vehicle: string;
  year_manufacture: string;
  previous_plate:   string;
  current_plate:    string;
  count_passengers: number;
  chassis:          string;
  tonnage:          string;
  entity_id:        number;
  type_id:          number;
  brand_id:         number;
  class_id:         number;
  model_id:         number;
  color_one_id:     number;
  color_two_id:     number;
  group_economic:   number;
  tariff_activity:  number;
  category:         number;
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

