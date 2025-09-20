import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputLabeled({
  id,
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
