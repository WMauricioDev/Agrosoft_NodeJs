import { Switch } from "@heroui/react";

export default function Switcher(props) {
  return (
    <div className="flex gap-4">
      <Switch {...props} />
    </div>
  );
}
