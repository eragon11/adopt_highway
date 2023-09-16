interface FilterType {
  role: string;
  query: string;
}

interface TypeGroup {
  name: string;
  type: FilterType[];
}
export class UserRoleTypeFilter {
  filterType: TypeGroup[] = [
    {
      name: 'Role',
      type: [
        { role: 'Administrator', query: 'includeAdministratorRoles' },
        {
          role: 'District Coordinator',
          query: 'includeDistrictCoordinatorRoles',
        },
        {
          role: 'Maintenance Coordinator',
          query: 'includeMaintenanceCoordinatorRoles',
        },
      ],
    },
    {
      name: 'Status',
      type: [
        { role: 'Active', query: 'includeActiveUsers' },
        { role: 'Inactive', query: 'includeInactiveUsers' },
      ],
    },
  ];
}
