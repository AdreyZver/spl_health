import { useAuth } from "../../../hooks/useAuth";
import { OrdinaryUserPersonalInfo } from "./OrdinaryUserPersonalInfo/OrdinaryUserPersonalInfo";
import { OrganizationPersonalInfo } from "./OrganizationPersonalInfo/OrganizationPersonalInfo";

export const PersonalInfo = () => {
  const { isOrganizationUser } = useAuth();

  if (isOrganizationUser) {
    return (
      <OrganizationPersonalInfo />
    )
  } else {
    return (
      <OrdinaryUserPersonalInfo />
    )
  }
}