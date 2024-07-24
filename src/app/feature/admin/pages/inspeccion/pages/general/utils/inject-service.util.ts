import {ActivatedRoute} from "@angular/router";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {inject} from "@angular/core";
import {InspectionService} from "../../../services/inspection.service";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";

export const injectServiceInspection = () => {
  const acc: ActivatedRoute = inject(ActivatedRoute);
  const typeInspection = acc.snapshot.paramMap.get('typeInspection')!

  if (typeInspection == TypeInspection.Commercial)
    return inject(InspectionService)
  else if (typeInspection === TypeInspection.Construction)
    return inject(InspectionConstructionService)
  else
    return inject(InspectionVehicleService)
}
