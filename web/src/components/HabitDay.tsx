interface HabitProps {
    amount: number
    completed: number
}

import * as Popover from "@radix-ui/react-popover";
import { ProgressBar } from "./progressBar";
import clsx from 'clsx'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react";

export function Habit(props: HabitProps) {

    const completedPorcentage = Math.round((props.completed / props.amount) * 100)

    return (
        <Popover.Root>
            <Popover.Trigger
                className={clsx('w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg',
                    {
                        'bg-violet-500 border-violet-400': completedPorcentage >= 80,
                        'bg-violet-600 border-violet-500': completedPorcentage >= 60 && completedPorcentage < 80,
                        'bg-violet-700 border-violet-500': completedPorcentage >= 40 && completedPorcentage < 60,
                        'bg-violet-800 border-violet-600': completedPorcentage >= 20 && completedPorcentage < 40,
                        'bg-violet-900 border-violet-700': completedPorcentage >= 0 && completedPorcentage < 20,
                        'bg-zinc-900 border-violet-800': completedPorcentage == 0
                    })
                }

            />


            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400 ">Segunda-feira</span>
                    <span className="mt-1 font-extrabold leadin-tight text-xl">20/01</span>

                    <ProgressBar progress={completedPorcentage} />

                    <div className="mt-6 flex flex-col gap-3">

                        <Checkbox.Root className="flex items-center gap-3 group">
                            <div 
                                className="h-8 rounded-lg w-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
                                group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500
                            ">
                                <Checkbox.Indicator >
                                    <Check 
                                        size={20}
                                        className= 'text-white'
                                    />
                                </Checkbox.Indicator>
                            </div>
                            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                                Beber 2l de água
                            </span>
                        </Checkbox.Root>

                    </div>

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root >
    )

}