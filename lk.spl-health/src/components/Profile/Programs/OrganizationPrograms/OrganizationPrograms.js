import React from "react";
import { useParams } from "react-router-dom";
import { OrganizationProgramsList } from "./OrganizationProgramsList/OrganizationProgramsList";
import { OrganizationProgramEdit } from "./OrganizationProgramEdit/OrganizationProgramEdit";

const getComponentByAdditionalParams = ({
  action,
  programId
}) => {
  switch (action) {
    case 'edit':
      return {
        Component: OrganizationProgramEdit,
        componentProps: {
          programId
        }
      }

    default:
      return {
        Component: OrganizationProgramsList,
      }
  }
}

export const OrganizationPrograms = () => {
  const { "*": additionalPageParams } = useParams();
  const [ action, programId ] = additionalPageParams.split('/');

  const { Component, componentProps } = getComponentByAdditionalParams({action, programId})

  return (
    <Component {...componentProps} />
  )
}