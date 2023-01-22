import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface habitListProps {
    date: Date;
    onCompletedChanged : (completed : number) => void
}

interface HabitsInfo {
    possibleHabtis: {
        id: string,
        title: string,
        created_at: string
    }[],
    completedHabits: string[]
}

export function HabistList({ date, onCompletedChanged }: habitListProps) {

    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

    useEffect(() => {
       
        api.get('/day', { params: {
            date: date.toISOString()
        }}).then((Response) => {
            setHabitsInfo(Response.data)
        })

    }, [])

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    async function handleToggleHabit(habitId: string) { 
        
        await api.patch(`/habits/${habitId}/toggle`)
        
        const isHabitAlredyCompleted = habitsInfo!.completedHabits.includes(habitId)

        let completedHabits : string [] = []

        if(isHabitAlredyCompleted){
            completedHabits = habitsInfo!.completedHabits.filter( id => id != habitId )
        }else{
            completedHabits = [ ...habitsInfo!.completedHabits, habitId ]
        }

        setHabitsInfo({
            possibleHabtis : habitsInfo!.possibleHabtis,
            completedHabits
        })

        onCompletedChanged(completedHabits.length)
    }

    return (



        <div className="mt-6 flex flex-col gap-3">

            {
                habitsInfo?.possibleHabtis.map((habit) => {
                    return (
                        <Checkbox.Root 
                        key={habit.id} 
                        onCheckedChange = {() => { handleToggleHabit(habit.id) }}
                        className="flex items-center gap-3 group"
                        defaultChecked = { habitsInfo.completedHabits.includes(habit.id) }
                        disabled = {isDateInPast}
                        >
                            <div
                                className="h-8 rounded-lg w-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
                                group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500
                            ">
                                <Checkbox.Indicator >
                                    <Check
                                        size={20}
                                        className='text-white'
                                    />
                                </Checkbox.Indicator>
                            </div>
                            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                                {habit.title}
                            </span>
                        </Checkbox.Root>

                    )
                })
            }


        </div>
    )


}