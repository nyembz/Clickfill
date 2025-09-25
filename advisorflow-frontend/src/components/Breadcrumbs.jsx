import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // A mapping for custom breadcrumb names
  const breadcrumbNameMap = {
    'dashboard': 'Dashboard',
    'client': 'Client Profile',
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.slice(1).map((value, index) => {
          const to = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;
          const displayName = breadcrumbNameMap[value] || value;

          return (
            <React.Fragment key={to}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;