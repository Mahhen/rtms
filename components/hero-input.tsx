"use client";

import { Shuffle, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AsyncQueryCombobox } from "@/components/async-search-combobox";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Zod schema for the train search form
const TrainLookupFormSchema = z.object({
    from: z.string().min(1, { message: "Please select a boarding station." }),
    to: z.string().min(1, { message: "Please select a destination." }),
    date: z.date(),
    // These fields are for storing the display names, not for the API call
    __boardingDisplay: z.string(),
    __destinationDisplay: z.string(),
});

// Zod schema for the PNR lookup form
const PNRLookupFormSchema = z.object({
    pnr: z.string().min(10, { message: "Please enter a valid 10-digit PNR." }).max(10),
});

type FormValues = {
    from: string;
    to: string;
    date: string;
    __boardingDisplay: string;
    __destinationDisplay: string;
};

type HeroInputProps = {
    simplifiedSearchMode?: boolean;
    initialValues?: Partial<FormValues>;
};

export const HeroInput = ({ simplifiedSearchMode = false, initialValues }: HeroInputProps) => {
    const router = useRouter();

    // Form hook for PNR lookup
    const pnrform = useForm<z.infer<typeof PNRLookupFormSchema>>({
        resolver: zodResolver(PNRLookupFormSchema),
        defaultValues: { pnr: "" },
    });

    // Form hook for train search
    const form = useForm<z.infer<typeof TrainLookupFormSchema>>({
        resolver: zodResolver(TrainLookupFormSchema),
        defaultValues: {
            from: initialValues?.from ?? "",
            to: initialValues?.to ?? "",
            date: initialValues?.date ? new Date(initialValues.date) : new Date(),
            __boardingDisplay: initialValues?.__boardingDisplay ?? "",
            __destinationDisplay: initialValues?.__destinationDisplay ?? "",
        },
    });

    // Function to swap the 'from' and 'to' stations
    const swapStations = () => {
        const fromValue = form.getValues("from");
        const fromDisplay = form.getValues("__boardingDisplay");
        const toValue = form.getValues("to");
        const toDisplay = form.getValues("__destinationDisplay");

        if (fromValue && toValue) {
            form.setValue("from", toValue);
            form.setValue("__boardingDisplay", toDisplay);
            form.setValue("to", fromValue);
            form.setValue("__destinationDisplay", fromDisplay);
        }
    };

    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);

    // Handler for submitting the train search form
    function onSubmit(data: z.infer<typeof TrainLookupFormSchema>) {
        const params = new URLSearchParams({
            from: data.from,
            to: data.to,
            // Format date to YYYY-MM-DD for consistency
            date: data.date.toISOString().split("T")[0],
            fromStation: data.__boardingDisplay,
            toStation: data.__destinationDisplay,
        }).toString();
        router.push(`/search?${params}`);
    }

    // Handler for submitting the PNR lookup form
    async function onSubmitPNRLookup(data: z.infer<typeof PNRLookupFormSchema>) {
        const pnrNumber = data.pnr;
        const toastId = toast.loading(`Searching for PNR: ${pnrNumber}...`);

        try {
            const response = await fetch(`/api/pnr/${pnrNumber}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "PNR lookup failed.");
            }
            
            toast.success("PNR Found! Redirecting...", { id: toastId });

            // On success, navigate to the status page, passing the booking data as a URL parameter
            const params = new URLSearchParams({
                booking: JSON.stringify(result.booking)
            }).toString();
            
            router.push(`/pnr-status?${params}`);

        } catch (error: any) {
            console.error("PNR lookup error:", error);
            toast.error(error.message, { id: toastId });
        }
    }

    return (
        <div
            className={cn(
                "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg",
                "rounded-2xl p-6 w-full max-w-3xl mt-6",
                !simplifiedSearchMode && "dark",
                simplifiedSearchMode && "bg-white/80"
            )}>

            <Tabs defaultValue="book">
                <TabsList className={cn("bg-white/10", simplifiedSearchMode && "hidden")}>
                    <TabsTrigger value="book">🚆 Book a Train</TabsTrigger>
                    <TabsTrigger value="pnr">🎫 PNR Status</TabsTrigger>
                </TabsList>
                {!simplifiedSearchMode && <div className="mb-3" />}
                
                <TabsContent value="book">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                {/* From Station */}
                                <FormField
                                    control={form.control}
                                    name="from"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" role="combobox" className={cn('justify-between w-full md:w-[160px]', !field.value && !simplifiedSearchMode && "text-white/80")}>
                                                            {field.value ? form.getValues("__boardingDisplay") : "From"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <AsyncQueryCombobox onSelectResult={(station) => {
                                                        form.setValue("from", station.stationId);
                                                        form.setValue("__boardingDisplay", station.stationName);
                                                        setOpenFrom(false);
                                                    }} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Swap Button */}
                                <Button className="border-none self-center" type="button" variant="outline" onClick={swapStations}>
                                    <Shuffle />
                                </Button>

                                {/* To Station */}
                                <FormField
                                    control={form.control}
                                    name="to"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover open={openTo} onOpenChange={setOpenTo}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" role="combobox" className={cn('justify-between w-full md:w-[160px]', !field.value && !simplifiedSearchMode && "text-white/80")}>
                                                            {field.value ? form.getValues("__destinationDisplay") : "To"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <AsyncQueryCombobox onSelectResult={(station) => {
                                                        form.setValue("to", station.stationId);
                                                        form.setValue("__destinationDisplay", station.stationName);
                                                        setOpenTo(false);
                                                    }} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                {/* Date Picker */}
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-full md:w-auto pl-3 text-left font-normal", !field.value && !simplifiedSearchMode && "text-white/80")}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={{ before: new Date() }} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                
                                {/* Search Button */}
                                <Button type="submit" className={cn("bg-rose-700/40 hover:bg-rose-800 text-white px-6 w-full md:w-auto", simplifiedSearchMode && "bg-red-800 hover:bg-red-900")}>
                                    Search Trains
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="pnr">
                    <Form {...pnrform}>
                        <form onSubmit={pnrform.handleSubmit(onSubmitPNRLookup)}>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <FormField
                                    control={pnrform.control}
                                    name="pnr"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input className="w-full text-black" placeholder="Enter 10-digit PNR" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={pnrform.formState.isSubmitting} className="bg-rose-700/40 hover:bg-rose-800 text-white px-6 w-full sm:w-auto">
                                    Check Status
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    )
}