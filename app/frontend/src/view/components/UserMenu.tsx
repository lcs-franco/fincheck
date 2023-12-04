import { ExitIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from './DropdownMenu';
import { useAuth } from '../../app/hooks/useAuth';

export function UserMenu() {
  const { signout, user } = useAuth();

  function avatar(name: string) {
    const names = name.split(' ');
    return names[0].charAt(0) + names[1].charAt(0);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="bg-teal-50 rounded-full w-12 h-12 flex items-center justify-center border border-teal-100">
          <span className="text-sm tracking-[-0.5px] text-teal-900 font-medium">
            {avatar(user!.name).toUpperCase()}
          </span>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="w-32">
        <DropdownMenu.Item
          onSelect={signout}
          className="flex items-center justify-between"
        >
          Sair
          <ExitIcon className="w-4 h-4" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}