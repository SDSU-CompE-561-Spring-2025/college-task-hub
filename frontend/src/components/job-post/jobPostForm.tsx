"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";  // Use Controller for controlled components
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";

const formSchema = z.object({
    title: z.string().min(2, { message: "Job title is required" }),
    category: z.string().nonempty({ message: "Please select a category" }),
    description: z
        .string()
        .min(10, { message: "Description is too short" })
        .max(500, { message: "Description is too long (max 500 characters)" }),
    rate: z.string().nonempty({ message: "Rate is required" }),
    estimatedTime: z.string().nonempty({ message: "Estimated time is required" }),
    paymentMethod: z.enum(["Cash", "Venmo", "PayPal", "Other"], {
        required_error: "Select a payment method",
    }),
    location: z.string().min(2, { message: "Location is required" }),
});

type JobFormValues = z.infer<typeof formSchema>;

const JobPostForm = () => {
    const form = useForm<JobFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "",
            description: "",
            rate: "",
        },
    });

    const onSubmit = (data: JobFormValues) => {
        console.log("Submitted data:", data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input className="border-0 border-b" placeholder="e.g. Help Move a Couch" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input className="border-0 border-b" placeholder="e.g. Labor" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the task..." {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rate</FormLabel>
                                <FormControl>
                                    <Input className="border-0 border-b" placeholder="$20/hr or flat rate" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="estimatedTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated Time</FormLabel>
                                <FormControl>
                                    <Input className="border-0 border-b" placeholder="e.g. 2 hours" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Venmo">Venmo</SelectItem>
                                            <SelectItem value="PayPal">PayPal</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input className="border-0 border-b" placeholder="e.g. 123 Main St, San Diego, CA" {...field} />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                        <Button type="submit">Post Job</Button>
                    </form>
                </Form>
    );
};

export default JobPostForm;
