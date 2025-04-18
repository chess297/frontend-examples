import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().min(1, "Icon is required"),
});
export default function AddDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      path: "",
      icon: "",
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>Add</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Menu</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="User Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"title"}
          />
          <FormField
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Path</FormLabel>
                <FormControl>
                  <Input placeholder="/admin/user-manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"path"}
          />
          <FormField
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input placeholder="/admin/user-manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"icon"}
          />
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
