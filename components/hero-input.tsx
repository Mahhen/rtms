"use client";

import {Shuffle, ChevronsUpDown, CalendarIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {toast} from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar";
import {z} from "zod";
import {useForm} from "react-hook-form";
import { cn } from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {AsyncQueryCombobox} from "@/components/async-search-combobox";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

const TrainLookupFormSchema = z.object({
    from: z.string({error: "Please select a boarding station."}),
    to: z.string({error: "Please select a destination"}),
    date: z.date({error: "Please enter a valid date."}),

    // to keep track of station display names efficiently; not req for api
    __boardingDisplay: z.string(),
    __destinationDisplay: z.string(),
});

const PNRLookupFormSchema = z.object({
    pnr: z.string().min(1, {error: "Please enter a valid number."}),
});

type FormValues = {
    from: string
    to: string
    date: string
    __boardingDisplay: string
    __destinationDisplay: string
};


type HeroInputProps = {
    simplifiedSearchMode?: boolean;
    initialValues?: Partial<FormValues>;
}

export const HeroInput = ({simplifiedSearchMode = false, initialValues}: HeroInputProps) => {
    const router = useRouter()

    const pnrform = useForm<z.infer<typeof PNRLookupFormSchema>>({
        resolver: zodResolver(PNRLookupFormSchema),
        defaultValues: {
            pnr: ""
        }
    });

    const form = useForm<z.infer<typeof TrainLookupFormSchema>>({
        resolver: zodResolver(TrainLookupFormSchema),
        defaultValues: {
            from: initialValues?.from ?? "",
            to: initialValues?.to ?? "",
            date: initialValues?.date ? new Date(initialValues.date) : undefined,
            __boardingDisplay: initialValues?.__boardingDisplay ?? "",
            __destinationDisplay: initialValues?.__destinationDisplay ?? "",
        }
    });

    const swapStations = () => {
        const currentBoarding = form.getValues("from");
        const currentBoardingDisplayName = form.getValues("__boardingDisplay");
        const currentDestination = form.getValues("to");
        const currentDestinationDisplayName = form.getValues("__destinationDisplay");

        if (currentDestination && currentBoarding) {
            form.setValue("to", currentBoarding);
            form.setValue("__destinationDisplay", currentBoardingDisplayName)
            form.setValue("from", currentDestination);
            form.setValue("__boardingDisplay", currentDestinationDisplayName);
        }
    };

    const [openCBX1, setOpenCBX1] = useState(false);
    const [openCBX2, setOpenCBX2] = useState(false);

    function onSubmit(data: z.infer<typeof TrainLookupFormSchema>) {
        //
        // toast("You submitted the following values", {
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //   <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        // </pre>
        //     ),
        // });

        const params = new URLSearchParams({
            from: data.from,
            to: data.to,
            date: data.date.toISOString().split("T")[0],
            __boardingDisplay: data.__boardingDisplay,
            __destinationDisplay: data.__destinationDisplay,
        }).toString();
        router.push(`/search?${params}`)
    }

    function onSubmitPNRLookup(data: z.infer<typeof PNRLookupFormSchema>) {
        // todo: implement pending
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            )
        })
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
                <TabsList
                    className={cn(
                        "bg-white/10",
                        simplifiedSearchMode && "hidden",
                    )}
                >
                    <TabsTrigger value="book">🚆 Book a Train</TabsTrigger>
                    <TabsTrigger value="pnr">🎫 PNR Status</TabsTrigger>
                </TabsList>
                {!simplifiedSearchMode && <div className="mb-3"/>}
                <TabsContent value="book">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* boarding station selection field */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="from"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover open={openCBX1} onOpenChange={setOpenCBX1}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    'justify-between w-[160px]',
                                                                    !field.value && !simplifiedSearchMode && "text-white/80"
                                                                )}
                                                            >
                                                                {field.value ? form.getValues("__boardingDisplay") : "Boarding"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <AsyncQueryCombobox onSelectResult={(station) => {
                                                            form.setValue("from", station.stationId);
                                                            form.setValue("__boardingDisplay", station.stationName);
                                                            setOpenCBX1(false);
                                                        }}/>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                { /* Swap button */}
                                <div>
                                    <Button
                                        className="border-none"
                                        type="button"
                                        variant="outline"
                                        onClick={swapStations}>
                                        <Shuffle />
                                    </Button>
                                </div>

                                { /* destination selection field */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="to"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover open={openCBX2} onOpenChange={setOpenCBX2}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    'justify-between w-[160px]',
                                                                    !field.value && !simplifiedSearchMode &&  "text-white/80"
                                                                )}
                                                            >
                                                                {field.value ? form.getValues("__destinationDisplay") : "Destination"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <AsyncQueryCombobox onSelectResult={(station) => {
                                                            form.setValue("to", station.stationId);
                                                            form.setValue("__destinationDisplay", station.stationName);
                                                            setOpenCBX2(false);
                                                        }} />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                { /*Date field*/}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[160px] pl-3 text-left",
                                                                    !field.value && !simplifiedSearchMode && "text-white/80"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={{ before: new Date()}}
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )} />
                                </div>

                                {/* Search Button */}
                                <Button
                                    className={cn(
                                        "bg-rose-700/40 hover:bg-rose-800 text-white px-6 py-2 w-full md:w-auto",
                                        simplifiedSearchMode && "bg-red-800 hover:bg-red-900",
                                    )}
                                >
                                    Search Trains
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="pnr">
                    <Form {...pnrform}>
                        <form onSubmit={pnrform.handleSubmit(onSubmitPNRLookup)}>
                            <div className="flex gap-4 items-center">
                                <FormField
                                    control={pnrform.control}
                                    name="pnr"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input className="w-full"
                                                       placeholder="PNR" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="bg-rose-700/40 hover:bg-rose-800 text-white px-6 py-2 w-full md:w-auto"
                                >
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

