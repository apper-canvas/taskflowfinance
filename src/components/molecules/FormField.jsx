import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  multiline = false, 
  error, 
  className, 
  required,
  ...props 
}) => {
  const InputComponent = multiline ? Textarea : Input;
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <InputComponent type={type} {...props} />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;