import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Users, FileText, Settings, ChevronsUpDown, Archive, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col fixed">
      {/* Top Workspace Section */}
      <div className="p-4 border-b">
        <Button variant="ghost" className="w-full justify-between h-auto py-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-left">AdvisorFlow</p>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-gray-500" />
        </Button>
      </div>

      {/* Middle Navigation Section */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard" className={navLinkClasses}>
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/clients" className={navLinkClasses}>
                <Users className="w-4 h-4 mr-3" />
                Clients
              </NavLink>
            </li>
            {/* Example of a Collapsible Section */}
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className={navLinkClasses({ isActive: false }) + " w-full"}>
                  <FileText className="w-4 h-4 mr-3" />
                  Templates
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="pl-10 py-1 space-y-1">
                  <li><NavLink to="/templates/pdf" className={navLinkClasses}>PDFs</NavLink></li>
                  <li><NavLink to="/templates/excel" className={navLinkClasses}>Excel</NavLink></li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </ul>
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto py-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-left">User Name</p>
                  <p className="text-xs text-gray-500">user@email.com</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;