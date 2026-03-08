import { useAuth } from "../../../hooks/useAuth";
import { OrganizationPrograms } from "./OrganizationPrograms/OrganizationPrograms";
import { OrdinaryUserPrograms } from "./OrdinaryUserPrograms/OrdinaryUserPrograms";

export const ProfilePrograms = () => {
  const { isOrganizationUser } = useAuth();

  if (isOrganizationUser) {
    return (
      <OrganizationPrograms />
    )
  } else {
    return (
      <OrdinaryUserPrograms />
    )
  }
}