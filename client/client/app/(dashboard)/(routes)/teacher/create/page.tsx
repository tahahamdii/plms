"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { title } from "process";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

const CreatePage = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const {isSubmitting, isValid} = form.formState;
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Course Name:</h1>
                <p className="text-sm text-slate-600">
                    Tell us about your course name, you can change it later . 
                </p>
                <Form {...form}>
                    <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-8 mt-8"
                    >
                        <FormField 
                          control={form.control}
                          name="title"
                          render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Course title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      placeholder="e.g. 'فن النكاح'"
                                      {...field}
                                    />
                                </FormControl>
                            </FormItem>
                          )}
                        />

                    </form>

                </Form>
            </div>
        </div>
    );
}

export default CreatePage;