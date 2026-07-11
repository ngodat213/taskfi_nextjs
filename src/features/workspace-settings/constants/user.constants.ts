import { TRANSLATION_KEYS } from "@/constants/translations";

const TK = TRANSLATION_KEYS.modals.addUser;

export const DEPARTMENTS = [
  { value: "engineering", label: TK.departmentOptions.engineering },
  { value: "design", label: TK.departmentOptions.design },
  { value: "marketing", label: TK.departmentOptions.marketing },
  { value: "product", label: TK.departmentOptions.product },
  { value: "sales", label: TK.departmentOptions.sales },
];

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: TK.employmentOptions.fullTime },
  { value: "part-time", label: TK.employmentOptions.partTime },
  { value: "contractor", label: TK.employmentOptions.contractor },
];
