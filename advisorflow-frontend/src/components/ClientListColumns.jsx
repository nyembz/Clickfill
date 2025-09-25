import { Link } from "react-router-dom"; // 1. Make sure Link is imported
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export const columns = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Client Type",
    cell: ({ row }) => {
        const type = row.getValue("type")
        const formatted = type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")
        return <div className="font-medium">{formatted}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              Copy client email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* 2. Update the menu items to be functional links */}
            <DropdownMenuItem asChild>
              <Link to={`/client/${client.id}`}>View client</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/client/${client.id}`}>View documents</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]